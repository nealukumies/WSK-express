import {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  deleteUser,
} from '../models/user-model.js';
const getUsers = async (req, res) => {
  res.json(await listAllUsers());
};
import bcrypt from 'bcrypt';

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the request body
    const result = await addUser({
      name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      email: req.body.email,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in postUser:', error);
    res.status(500).send('Internal Server Error');
  }
};

const putUser = async (req, res) => {
  const user = res.locals.user;
  if (req.body.role && req.body.role === 'admin' && user.role !== 'admin') {
    return res
      .status(403)
      .json({message: 'Unauthorized to change role to admin'});
  }
  const result = await modifyUser(req.body, req.params.id, user.user_id);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

const removeUser = async (req, res) => {
  const user = res.locals.user;
  const result = await deleteUser(req.params.id, user.role);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = res.locals.user;
    const result = await modifyUser(user.role, req.params.id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    res.status(500).send('Internal Server Error');
  }
};

export {getUsers, getUserById, postUser, putUser, removeUser, updateUserRole};
