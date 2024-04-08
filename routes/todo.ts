import express from 'express';

import { create, getAll, update, destroy } from '../controllers/todoController';
import isAuthenticated from '../middleware/auth';

const todoRouter = express.Router();

todoRouter
  .post('/', isAuthenticated, create)
  .get('/', isAuthenticated, getAll)
  .put('/', isAuthenticated, update);
todoRouter.delete('/:id', isAuthenticated, destroy);

export default todoRouter;
