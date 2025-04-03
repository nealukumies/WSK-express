import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import path from 'path';

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

export {authenticateToken, createThumbnail};
