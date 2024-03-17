import express from 'express';
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import { MessageResponse } from '@sharedTypes/MessageTypes';
import habitRoute from './routes/habitRouter';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({ message: 'Connected!' });
});

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/habits', habitRoute)

export default router;
