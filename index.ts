import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import todoRouter from './routes/todo';
import userRouter from './routes/user';

dotenv.config();

const app = express();
const port = 8000;

mongoose.connect(process.env.MONGO_URL as string);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/todos', todoRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server is Running on PORT: ${port}`);
});
