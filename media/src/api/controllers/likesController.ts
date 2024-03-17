import {Like, TokenUser} from '@sharedTypes/DBTypes';
import {
  deleteLike,
  fetchLikesByPostAndUser,
  getAllLikes,
  getLikeByUser,
  getLikesByPost,
  getLikesCount,
  postLike,
} from '../models/likesModel';
import {Request, NextFunction, Response} from 'express';
import CustomError from '../../classes/CustomError';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getLikes = async (
  req: Request,
  res: Response<Like[]>,
  next: NextFunction,
) => {
  try {
    const likes = await getAllLikes();
    if (likes) {
      res.json(likes);
      return;
    }
    next(new CustomError('No likes found', 404));
  } catch (error) {
    next(error);
  }
};

const getLikeByPostId = async (
  req: Request<{id: string}>,
  res: Response<Like[]>,
  next: NextFunction,
) => {
  try {
    const likes = await getLikesByPost(Number(req.params.id));
    if (likes) {
      res.json(likes);
      return;
    }
    next(new CustomError('No likes found', 404));
  } catch (error) {
    next(error);
  }
};

// Post a new like
const createLike = async (
  req: Request<{}, {}, {post_id: string}>,
  res: Response<MessageResponse, {user: TokenUser}>,
  next: NextFunction,
) => {
  try {
    const result = await postLike(
      Number(req.body.post_id),
      res.locals.user.user_id,
    );
    console.log('result', result);
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Like not created', 500));
  } catch (error) {
    next(error);
  }
};

const getCount = async (
  req: Request<{id: string}>,
  res: Response<{count: number}>,
  next: NextFunction,
) => {
  try {
    const count = await getLikesCount(Number(req.params.id));
    if (count) {
      res.json({count});
      return;
    }
    next(new CustomError('No likes found', 404));
  } catch (error) {
    next(error);
  }
};

const getLikeByUserId = async (
  req: Request<{id: string}>,
  res: Response<Like[]>,
  next: NextFunction,
) => {
  console.log(res.locals.user);
  console.log(req.params.id);
  try {
    const likes = await getLikeByUser(Number(req.params.id));
    console.log('likes', likes);
    if (likes) {
      res.json(likes);
      return;
    }
    next(new CustomError('No likes found', 404));
  } catch (error) {
    next(error);
  }
};

const removeLike = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenUser}>,
  next: NextFunction,
) => {
  try {
    const result = await deleteLike(
      Number(req.params.id),
      res.locals.user.user_id,
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Like not deleted', 500));
  } catch (error) {
    next(error);
  }
};

const getLikeByPostAndUser = async (
  req: Request<{id: string}>,
  res: Response<Like, {user: TokenUser}>,
  next: NextFunction,
) => {
  try {
    const likes = await fetchLikesByPostAndUser(
      Number(req.params.id),
      res.locals.user.user_id,
    );
    if (likes) {
      res.json(likes);
      return;
    }
    next(new CustomError('No likes found', 404));
  } catch (error) {
    next(error);
  }
};

export {
  getLikes,
  createLike,
  getCount,
  getLikeByUserId,
  removeLike,
  getLikeByPostId,
  getLikeByPostAndUser,
};
