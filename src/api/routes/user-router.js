import express from 'express';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  removeUser,
  updateUserRole,
} from '../controllers/user-controller.js';

import {authenticateToken} from '../../middlewares.js';

const userRouter = express.Router();

userRouter.route('/').get(getUsers).post(postUser);

userRouter
  .route('/:id')
  .get(getUserById)
  .put(authenticateToken, putUser)
  .delete(removeUser);

userRouter.put('/:id/role', authenticateToken, updateUserRole);

export default userRouter;
