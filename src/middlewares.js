import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const createThumbnail = async (req, res, next) => {
  console.log('todo: tee kuvakäsittely', req.file);
  if (!req.file) {
    console.log(req.file);
    next();
    return;
  }

  let extension = 'jpg';
  if (req.file.mimetype === 'image/png') {
    // if (req.file.mimetype.includes('/png')) {
    extension = 'png';
  }

  await sharp(req.file.path)
    .resize(100, 100)
    .toFile(`${req.file.path}_thumb.${extension}`);
  console.log(req.file);
  next();
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

export {authenticateToken, createThumbnail};
