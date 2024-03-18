import {Request, Response, NextFunction} from 'express';
import {
  createComment,
  deleteCommentById,
  getComments,
  getCommentsByPostId,
  getCommentsByUserId,
  getCommentsCountByPostId,
  putComment,
} from '../models/commentModel';
import {Comment, CommentWithOwner, TokenUser} from '@sharedTypes/DBTypes';
import CustomError from '../../classes/CustomError';
import {CommentResponse, MessageResponse} from '@sharedTypes/MessageTypes';
const getAllComments = async (
  req: Request,
  res: Response<CommentWithOwner[]>,
  next: NextFunction,
) => {
  try {
    const comments = await getComments();
    if (comments) {
      res.json(comments);
      return;
    }
    next(new CustomError('No comments found', 404));
  } catch (error) {
    next(error);
  }
};

const getCommentsForPost = async (
  req: Request<{id: string}>,
  res: Response<CommentWithOwner[]>,
  next: NextFunction,
) => {
  try {
    const commentResult = await getCommentsByPostId(Number(req.params.id));
    if (commentResult) {
      res.json(commentResult);
      return;
    }
    next(new CustomError('No comments found', 404));
  } catch (error) {
    next(error);
  }
};

const getCommentsCountForPost = async (
  req: Request<{id: string}>,
  res: Response<{count: number}>,
  next: NextFunction,
) => {
  try {
    const countResult = await getCommentsCountByPostId(Number(req.params.id));
    if (countResult) {
      res.json({count: countResult});
      return;
    }
    next(new CustomError('No comments found', 404));
  } catch (error) {
    next(error);
  }
};

const getCommentsOfUser = async (
  req: Request,
  res: Response<Comment[], {user: TokenUser}>,
  next: NextFunction,
) => {
  try {
    const comments = await getCommentsByUserId(Number(res.locals.user.user_id));
    if (comments) {
      res.json(comments);
      return;
    }
    next(new CustomError('No comments found', 404));
  } catch (error) {
    next(error);
  }
};

const postComment = async (
  req: Request<{}, {}, Omit<Comment, 'comment_id'>>,
  res: Response<CommentResponse, {user: TokenUser}>,
  next: NextFunction,
) => {
  try {
    req.body.user_id = res.locals.user.user_id;
    const comment = await createComment(req.body);
    if (comment) {
      res.json({message: 'Comment created', comment});
      return;
    }
    next(new CustomError('Comment not created', 500));
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenUser; token: string}>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteCommentById(id, res.locals.user.user_id);
    if (result) {
      res.json({message: 'Comment deleted'});
      return;
    }
    const error = new CustomError('Comment not deleted', 500);
    next(error);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (
  req: Request<{id: string}, {}, {comment_text: string}>,
  res: Response<MessageResponse, {user: TokenUser}>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const result = await putComment(
      id,
      res.locals.user.user_id,
      req.body.comment_text,
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Comment not updated', 500));
  } catch (error) {
    next(error);
  }
};

export {
  getAllComments,
  getCommentsForPost,
  getCommentsCountForPost,
  getCommentsOfUser,
  postComment,
  deleteComment,
  updateComment,
};
