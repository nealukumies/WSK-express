import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import path from 'path';
import {validationResult} from 'express-validator';

const createThumbnail = async (req, res, next) => {
  console.log('Processing image:', req.file);

  if (!req.file) {
    next();
    return;
  }

  const ext = path.extname(req.file.filename);
  const baseName = path.basename(req.file.filename, ext);
  const thumbName = `${baseName}${ext}_thumb`;
  const thumbPath = path.join(path.dirname(req.file.path), thumbName);

  try {
    await sharp(req.file.path).resize(100, 100).toFile(thumbPath);

    req.file.thumbname = thumbName; // Save for database
    console.log('Thumbnail created:', thumbName);
    next();
  } catch (error) {
    console.error('Thumbnail creation failed:', error);
    next(error);
  }
};

const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).send({message: 'invalid token'});
  }
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error); // forward error to error handler
};

const errorHandler = (err, req, res) => {
  res.status(err.status || 500); // default is 500 if err.status is not defined
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};

const validationErrors = async (req, res, next) => {
  // validation errors can be retrieved from the request object (added by express-validator middleware)
  const errors = validationResult(req);
  // check if any validation errors
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(', ');
    const error = new Error(messages);
    error.status = 400;
    next(error);
    return;
  }
  next();
};

export {
  authenticateToken,
  createThumbnail,
  notFoundHandler,
  errorHandler,
  validationErrors,
};
