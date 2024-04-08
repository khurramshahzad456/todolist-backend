import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import User from '../models/user';
import { isEmailValid } from '../utils/validate-email';

const create = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Email already exists' });
    }

    const { valid } = await isEmailValid(email);

    if (!valid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Please provide a valid email' });
    }

    if (password.length < 6) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Password must be greater than 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ email, username, password: hashedPassword });

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Signed Up Successfully' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Invalid Email or Password' });

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Invalid Email or Password',
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        username: user.username,
        _id: user._id,
      },
      process.env.JWT_SECRET as string
    );

    return res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Email is Required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'User with this email not found',
      });
    }

    return res.status(StatusCodes.OK).json({ email, username: user.username! });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export { create, login, get };
