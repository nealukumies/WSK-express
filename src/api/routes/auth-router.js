import {authUser, getMe} from '../controllers/auth-controller.js';
import {postUser} from '../controllers/user-controller.js';
import express from 'express';
import {authenticateToken, validationErrors} from '../../middlewares.js';
import {body} from 'express-validator';

const authRouter = express.Router();

authRouter.route('/login').post(authUser);
authRouter.route('/me').get(authenticateToken, getMe);
authRouter.post(
  '/register',
  body('email').trim().isEmail(),
  body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
  body('password').trim().isLength({min: 8}),
  validationErrors,
  postUser
);

export default authRouter;
