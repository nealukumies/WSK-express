import express from 'express';
import multer from 'multer';
import path from 'path';

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
  getCatByOwnerId,
} from '../controllers/cat-controller.js';
import {createThumbnail, authenticateToken} from '../../middlewares.js';
import {body, param, validationResult} from 'express-validator';

const catRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

catRouter
  .route('/')
  .get(getCat)
  .post(
    authenticateToken,
    [
      body('cat_name').notEmpty().withMessage('Name is required'),
      body('birthdate')
        .isISO8601()
        .withMessage('Birthdate must be a valid date')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Birthdate must be in YYYY-MM-DD format'),
      body('weight')
        .isFloat({min: 0})
        .withMessage('Weight must be a positive number'),
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
      next();
    },
    upload.single('file'),
    (req, res, next) => {
      if (!req.file) {
        return res
          .status(400)
          .json({errors: [{msg: 'File is required', param: 'file'}]});
      }
      next();
    },
    createThumbnail,
    postCat
  );

catRouter
  .route('/:id')
  .get(getCatById)
  .put(
    authenticateToken,
    [
      param('id').isInt().withMessage('Invalid cat ID'),
      body('name').optional().notEmpty().withMessage('Name cannot be empty'),
      body('birthdate')
        .optional()
        .isISO8601()
        .withMessage('Birthdate must be a valid date')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Use YYYY-MM-DD format'),
      body('weight')
        .optional()
        .isFloat({min: 0})
        .withMessage('Weight must be a positive number'),
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
      next();
    },
    putCat
  )
  .delete(authenticateToken, deleteCat);

catRouter.route('/owner/:id').get(getCatByOwnerId);

export default catRouter;
