import {TokenUser, Post, PostWithOwner} from '@sharedTypes/DBTypes';
import {Request, Response, NextFunction} from 'express';
import {
  deletePost,
  getAllPosts,
  getPostById,
  postPost,
  putPost,
} from '../models/postModel';
import CustomError from '../../classes/CustomError';
import {PostResponse, MessageResponse} from '@sharedTypes/MessageTypes';

const getPostsList = async (
  req: Request,
  res: Response<PostWithOwner[]>,
  next: NextFunction,
) => {
  try {
    const posts = await getAllPosts();
    if (posts) {
      res.json(posts);
      return;
    }
    const error = new CustomError('No posts found', 404);
    next(error);
  } catch (error) {
    next(error);
  }
};

const getPost = async (
  req: Request<{id: string}>,
  res: Response<Post>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const postResult = await getPostById(id);
    if (postResult) {
      res.json(postResult);
      return;
    }
    const error = new CustomError('No post found', 404);
    next(error);
  } catch (error) {
    next(error);
  }
};

const createPost = async (
  req: Request<{}, {}, Omit<Post, 'post_id'>>,
  res: Response<PostResponse, {user: TokenUser}>,
  next: NextFunction,
) => {
  try {
    req.body.user_id = res.locals.user.user_id;
    console.log('req.body', req.body);
    const newPost = await postPost(req.body);
    console.log('newPost', newPost);
    if (newPost) {
      res.json({message: 'Post created', post: newPost});
      return;
    }
    const error = new CustomError('Post not created', 500);
    next(error);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (
  req: Request<{id: string}, {}, Pick<Post, 'post_title' | 'post_text'>>,
  res: Response<PostResponse, {user: TokenUser}>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const post = await putPost(req.body, id, res.locals.user.user_id);
    if (post) {
      res.json({message: 'Post updated', post});
      return;
    }
    const error = new CustomError('Post not updated', 500);
    next(error);
  } catch (error) {
    next(error);
  }
};

const removePost = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenUser; token: string}>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const result = await deletePost(
      id,
      res.locals.user.user_id,
      res.locals.token,
    );
    if (result) {
      res.json({message: 'Post deleted'});
      return;
    }
    const error = new CustomError('Post not deleted', 500);
    next(error);
  } catch (error) {
    next(error);
  }
};

export {getPostsList, getPost, createPost, updatePost, removePost};
