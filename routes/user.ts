import express from 'express';

import { create, login, get } from '../controllers/userController';
import isAuthenticated from '../middleware/auth';

const userRouter = express.Router();

userRouter.post('/signin', login);
userRouter.post('/signup', create);
userRouter.get('/auth', isAuthenticated, get);

export default userRouter;
