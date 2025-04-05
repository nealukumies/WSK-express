import express from 'express';
import api from './api/index.js';
import cors from 'cors';
import {errorHandler, notFoundHandler} from './middlewares.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.use('/api/v1', api);

app.use('/uploads', express.static('uploads'));

// Default for all routes not handled by routers above
app.use(notFoundHandler);
// Add error handler middleware as the last middleware in the chain
app.use(errorHandler);
export default app;
