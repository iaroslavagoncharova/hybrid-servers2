import {Message} from '@sharedTypes/DBTypes';
import {NextFunction, Request, Response} from 'express';
import {getAllMessages} from '../models/messageModel';
import CustomError from '../../classes/CustomError';

const fetchMessages = async (
  req: Request,
  res: Response<Message>,
  next: NextFunction,
) => {
  try {
    const result = await getAllMessages();
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('No messages found', 404));
  } catch (error) {
    next(error);
  }
};

export {fetchMessages};
