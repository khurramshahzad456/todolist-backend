import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createTodoSchema, updateTodoSchema } from '../validations/todo';
import Todo from '../models/todo';
import User from '../models/user';

const create = async (req: Request, res: Response) => {
  const payload = req.body;
  const parsedPayload = createTodoSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return res
      .status(StatusCodes.LENGTH_REQUIRED)
      .json({ error: parsedPayload.error });
  }

  const { title, description } = parsedPayload.data;
  const todo = new Todo({ title, description });

  try {
    await todo.save();

    const user = await User.findOne({ email: payload.email });

    if (user) {
      user.todos.push(todo._id);
      await user.save();

      return res
        .status(StatusCodes.CREATED)
        .json({ todo, message: 'Todo Created Successfully!' });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'User Not Found' });
    }

    let todos = [];
    for (let todoId of user.todos) {
      const todoData = await Todo.findById(todoId);
      if (todoData) {
        todos.push(todoData);
      }
    }

    if (!todos) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'No Todos Found' });
    }
    return res
      .status(StatusCodes.OK)
      .json({ todos: todos.length ? todos : [] });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Todo Id is required' });
    }

    const parsedPayload = updateTodoSchema.safeParse({ id });

    if (!parsedPayload.success) {
      return res
        .status(StatusCodes.LENGTH_REQUIRED)
        .json({ error: parsedPayload.error });
    }

    await Todo.findByIdAndUpdate({ _id: id }, { completed: true });
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Todo Updated Successfully!' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Todo Id is required' });
    }

    const parsedPayload = updateTodoSchema.safeParse({ id });
    if (!parsedPayload.success) {
      return res
        .status(StatusCodes.LENGTH_REQUIRED)
        .json({ error: parsedPayload.error });
    }

    await Todo.findByIdAndDelete({ _id: id });
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Todo Deleted Successfully!' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export { create, getAll, update, destroy };
