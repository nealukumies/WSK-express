import express from 'express';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  removeUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/').get(getUsers).post(postUser);

userRouter.route('/:id').get(getUserById).put(putUser).delete(removeUser);

export default userRouter;
