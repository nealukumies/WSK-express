import express from 'express';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  removeUser,
  updateUserRole,
} from '../controllers/user-controller.js';
import {authenticateToken, validationErrors} from '../../middlewares.js';
import {body} from 'express-validator';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(getUsers)
  .post(
    body('email').trim().isEmail(),
    body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body('password').trim().isLength({min: 8}),
    validationErrors,
    postUser
  );

userRouter
  .route('/:id')
  .get(getUserById)
  .put(authenticateToken, putUser)
  .delete(removeUser);

userRouter.put('/:id/role', authenticateToken, updateUserRole);

export default userRouter;
