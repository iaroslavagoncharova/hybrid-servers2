import {
  Prompt,
  Reflection,
  ReflectionWithPrompt,
  TokenUser,
} from '@sharedTypes/DBTypes';
import {NextFunction, Request, Response} from 'express';
import {
  createReflection,
  fetchPrompts,
  getAllReflections,
  getReflectionsByUser,
} from '../models/reflectionsModel';

const getReflections = async (
  req: Request<{id: string}>,
  res: Response<ReflectionWithPrompt[], {user: TokenUser}>,
  next: NextFunction
) => {
  try {
    const result = await getReflectionsByUser(Number(req.params.id));
    if (result) {
      res.json(result);
      return;
    }
    const error = new Error('No reflections found');
    next(error);
  } catch (error) {
    next(error);
  }
};

const postReflection = async (
  req: Request<{}, {}, Omit<Reflection, 'reflection_id'>>,
  res: Response<{message: string}, {user: TokenUser}>,
  next: NextFunction
) => {
  try {
    const result = await createReflection(
      req.body.reflection_text,
      res.locals.user.user_id,
      req.body.prompt_id
    );
    if (result) {
      res.json(result);
      return;
    }
    const error = new Error('Reflection not created');
    next(error);
  } catch (error) {
    next(error);
  }
};

const fetchAllReflections = async (
  req: Request,
  res: Response<Reflection[]>,
  next: NextFunction
) => {
  try {
    const result = await getAllReflections();
    if (result) {
      res.json(result);
      return;
    }
    const error = new Error('No reflections found');
    next(error);
  } catch (error) {
    next(error);
  }
};

const fetchReflectionByUser = async (
  req: Request<{user_id: string}>,
  res: Response<Reflection[], {user: TokenUser}>,
  next: NextFunction
) => {
  try {
    const result = await getReflectionsByUser(res.locals.user.user_id);
    if (result) {
      console.log('result', result);
      res.json(result);
      return;
    } else {
      console.log('no result');
      return;
    }
  } catch (error) {
    next(error);
  }
};

const getPrompts = async (
  req: Request,
  res: Response<Prompt[]>,
  next: NextFunction
) => {
  try {
    const result = await fetchPrompts();
    if (result) {
      res.json(result);
      return;
    }
    const error = new Error('No prompts found');
    next(error);
  } catch (error) {
    next(error);
  }
};

export {
  getReflections,
  postReflection,
  fetchAllReflections,
  fetchReflectionByUser,
  getPrompts,
};
