import {User, UserHabits} from '@sharedTypes/DBTypes';
import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {
  getHabits,
  getHabitById,
  createHabit,
  getCreatedHabitById,
  getCreatedHabits,
  createFrequency,
  updateHabit,
  getHabitDates,
  addHabitDate,
} from '../models/habitModel';
import {
  FrequencyResponse,
  HabitResponse,
  MessageResponse,
} from '@sharedTypes/MessageTypes';
import {token} from 'morgan';

const getAllHabits = async (
  req: Request,
  res: Response<UserHabits[]>,
  next: NextFunction
) => {
  try {
    const habits = await getHabits();
    if (habits === null) {
      next(new CustomError('Habits not found', 404));
      return;
    }
    res.status(200).json(habits);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getHabit = async (
  req: Request<{id: number}>,
  res: Response<UserHabits>,
  next: NextFunction
) => {
  try {
    const habit = await getHabitById(req.params.id);
    if (habit === null) {
      next(new CustomError('Habit not found', 404));
      return;
    }
    res.json(habit);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getAllCreatedHabits = async (
  req: Request,
  res: Response<UserHabits[]>,
  next: NextFunction
) => {
  try {
    const habits = await getCreatedHabits();
    if (habits === null) {
      next(new CustomError('Habits not found', 404));
      return;
    }
    res.status(200).json(habits);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getCreatedHabit = async (
  req: Request<{id: number}>,
  res: Response<UserHabits>,
  next: NextFunction
) => {
  try {
    const habit = await getCreatedHabitById(req.params.id);
    if (habit === null) {
      next(new CustomError('Habit not found', 404));
      return;
    }
    res.json(habit);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const postHabit = async (
  req: Request<{}, {}, UserHabits>,
  res: Response<HabitResponse>,
  next: NextFunction
) => {
  try {
    const habit = req.body;
    if (
      !habit.habit_name ||
      !habit.habit_category ||
      !habit.habit_description
    ) {
      next(new CustomError('Missing required fields', 400));
      return;
    }
    const tokenUser = res.locals.user;
    const createdHabit = await createHabit(habit, tokenUser.user_id);
    if (!createdHabit) {
      next(new CustomError('Habit not created', 404));
      return;
    }
    const response: HabitResponse = {
      message: 'Habit created',
      habit: createdHabit,
    };
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const postFrequency = async (
  req: Request<{}, {}, FrequencyResponse>,
  res: Response<FrequencyResponse>,
  next: NextFunction
) => {
  try {
    const frequency = req.body.habit_frequency;
    if (!frequency) {
      next(new CustomError('Missing required fields', 400));
      return;
    }
    const tokenUser = res.locals.user;
    const updatedFrequency = await createFrequency(
      frequency,
      tokenUser.user_id
    );
    if (!updatedFrequency) {
      next(new CustomError('Frequency not updated', 404));
      return;
    }
    const response = {
      message: 'Frequency updated',
      habit_frequency: updatedFrequency,
    };
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const putHabit = async (
  req: Request<{id: string}>,
  res: Response<HabitResponse>,
  next: NextFunction
) => {
  try {
    const habit_id = req.body.habit_id;
    console.log('habit_id', habit_id);
    if (!habit_id) {
      next(new CustomError('No habit id provided', 400));
      return;
    }

    const tokenUser = res.locals.user;
    console.log(tokenUser.user_id, 'tokenUser.user_id');
    const updatedHabit = await updateHabit(habit_id, tokenUser.user_id);
    if (!updatedHabit) {
      next(new CustomError('Habit not updated', 404));
      return;
    }
    const response: HabitResponse = {
      message: 'Habit updated',
      habit: updatedHabit,
    };
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const postDates = async (
  req: Request<{id: string}, {}, {date: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const habit_id = Number(req.params.id);
    const date = req.body.date;
    if (!habit_id || !date) {
      next(new CustomError('Missing required fields', 400));
      return;
    }
    const tokenUser = res.locals.user;
    const updatedHabit = await addHabitDate(habit_id, tokenUser.user_id, date);
    if (!updatedHabit) {
      next(new CustomError('Date not added', 404));
      return;
    }
    const response: MessageResponse = {
      message: 'Date added',
    };
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getDates = async (
  req: Request<{id: string}>,
  res: Response<string[]>,
  next: NextFunction
) => {
  try {
    const habit_id = req.params.id;
    if (!habit_id) {
      next(new CustomError('No habit id provided', 400));
      return;
    }
    const tokenUser = res.locals.user;
    const dates = await getHabitDates(Number(habit_id), tokenUser.user_id);
    if (!dates) {
      next(new CustomError('Dates not found', 404));
      return;
    }
    res.json(dates);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

export {
  getAllHabits,
  getHabit,
  postHabit,
  getAllCreatedHabits,
  getCreatedHabit,
  postFrequency,
  putHabit,
  postDates,
  getDates,
};
