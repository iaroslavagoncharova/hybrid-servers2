require('dotenv').config();
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import {notFound, errorHandler} from './middlewares';
import api from './api';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const app = express();

app.use(morgan('dev'));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
// app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  next();
});
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API location: api/v1',
  });
});

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

export default app;
