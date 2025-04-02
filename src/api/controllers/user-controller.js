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
      password: req.body.password,
      email: req.body.email,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in postUser:', error);
    res.status(500).send('Internal Server Error');
  }
};

const putUser = async (req, res) => {
  const result = await modifyUser(req.body, req.params.id);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

const removeUser = async (req, res) => {
  const result = await deleteUser(req.params.id);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

export {getUsers, getUserById, postUser, putUser, removeUser};
