import {NextFunction, Request, Response} from 'express';
import {
  createUser,
  getUserById,
  getUserByUsername,
  getUsers,
  removeUser,
  updateUser,
  getUserByEmail,
} from '../models/userModel';
import bcrypt from 'bcryptjs';
import {
  PutUserValues,
  TokenUser,
  UnauthorizedUser,
  User,
  UserHabits,
} from '@sharedTypes/DBTypes';
import {UserDeleteResponse, UserResponse} from '@sharedTypes/MessageTypes';
import {token} from 'morgan';
import CustomError from '../../classes/CustomError';
import {validationResult} from 'express-validator';

const salt = bcrypt.genSaltSync(10);

const getAllUsers = async (
  req: Request,
  res: Response<UnauthorizedUser[]>,
  next: NextFunction
) => {
  try {
    const users = await getUsers();
    if (users === null) {
      next(new CustomError('Users not found', 404));
      return;
    }
    res.status(200).json(users);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getUser = async (
  req: Request<{id: number}>,
  res: Response<UnauthorizedUser>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('userGet validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = await getUserById(req.params.id);
    if (user === null) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(user);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const checkUsername = async (
  req: Request<{username: string}>,
  res: Response<{available: boolean}>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('userPost validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = await getUserByUsername(req.params.username);
    if (user === null) {
      res.json({available: true});
      return;
    }
    res.json({available: user ? false : true});
  } catch (e) {
    next(new Error((e as Error).message));
  }
};

const postUser = async (
  req: Request<{}, {}, User>,
  res: Response<UserResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('userPost validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, salt);

    console.log(user, 'user');
    const createdUser = await createUser(user);
    console.log(createdUser);
    if (!createdUser) {
      next(new CustomError('User not created', 500));
      return;
    }
    const response: UserResponse = {
      message: 'User created',
      user: createdUser,
    };
    res.json(response);
  } catch (e) {
    next(new CustomError('Duplicate entry', 200));
  }
};

const putUser = async (
  req: Request<{}, {}, PutUserValues>,
  res: Response<UserResponse, {user: TokenUser}>,
  next: NextFunction
) => {
  const {email, username, password} = req.body;
  if (!email && !username && !password) {
    next(new CustomError('No fields to update', 400));
    return;
  }

  const user = {
    email: email || null,
    username: username || null,
    password: password || null,
  };
  try {
    const tokenUser = res.locals.user;
    const updatedUser = await updateUser(user, tokenUser.user_id);
    console.log(updatedUser, 'updatedUser');
    if (!updatedUser) {
      next(new CustomError('User not updated', 404));
      return;
    }
    const response: UserResponse = {
      message: 'User updated',
      user: updatedUser,
    };
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const deleteUser = async (
  req: Request,
  res: Response<UserDeleteResponse, {user: TokenUser}>,
  next: NextFunction
) => {
  try {
    const tokenUser = res.locals.user;
    const deletedUser = await removeUser(tokenUser.user_id);
    if (!deletedUser) {
      next(new CustomError('User not deleted', 404));
      alert('User not found or already deleted');
      return;
    }
    res.json(deletedUser);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const checkToken = async (
  req: Request,
  res: Response<UserResponse, {user: TokenUser}>,
  next: NextFunction
) => {
  const tokenUser = res.locals.user;
  console.log(tokenUser, 'tokenUser');
  const user = await getUserById(tokenUser.user_id);
  if (!user) {
    next(new CustomError('User not found', 404));
    return;
  }
  const response: UserResponse = {
    message: 'Token valid',
    user: user,
  };
  res.json(response);
};

const checkEmail = async (
  req: Request<{email: string}>,
  res: Response<{available: boolean}>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('userPost validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = await getUserByEmail(req.params.email);
    if (user === null) {
      res.json({available: true});
      return;
    }
    res.json({available: user ? false : true});
  } catch (e) {
    next(new Error((e as Error).message));
  }
};

export {
  getAllUsers,
  getUser,
  postUser,
  checkUsername,
  putUser,
  deleteUser,
  checkToken,
  checkEmail,
};
