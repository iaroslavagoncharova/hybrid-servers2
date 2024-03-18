import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {User, UserHabits} from '@sharedTypes/DBTypes';
import {getUserById} from './userModel';
import {parse} from 'path';
import { getHabit } from '../controllers/habitController';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getHabits = async (): Promise<UserHabits[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & UserHabits[]>(
      'SELECT Habits.habit_id, Habits.habit_name, Habits.habit_description, Habits.habit_category, Habits.is_default FROM Habits'
    );
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getHabitById = async (id: number): Promise<UserHabits | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & UserHabits[]>(
      'SELECT Habits.habit_id, Habits.habit_name, Habits.habit_description, Habits.habit_category FROM Habits WHERE Habits.habit_id = ?',
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getDefaultHabitById', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getCreatedHabits = async (): Promise<UserHabits[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & UserHabits[]>(
      'SELECT Habits.habit_id, Habits.habit_name, Habits.habit_description, Habits.habit_category FROM Habits WHERE Habits.is_default = 0'
    );
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getCreatedHabitById = async (id: number): Promise<UserHabits | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & UserHabits[]>(
      'SELECT Habits.habit_id, Habits.habit_name, Habits.habit_description, Habits.habit_category FROM Habits WHERE Habits.habit_id = ? AND Habits.is_default = 0',
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getCreatedHabitById', (e as Error).message);
    throw new Error((e as Error).message);
  }
};


const createHabit = async (
  habit: Omit<UserHabits, 'habit_id'>,
  user_id: number
) => {
  try {
    const insertResult = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Habits (habit_name, habit_description, habit_category, user_id, is_default) VALUES (?, ?, ?, ?, ?)',
      [
        habit.habit_name,
        habit.habit_description,
        habit.habit_category,
        user_id,
        0,
      ]
    );

    const lastInsertId = insertResult[0].insertId;

    const updateResult = await promisePool.execute<ResultSetHeader>(
      'UPDATE Users SET habit_id = ? WHERE user_id = ?',
      [lastInsertId, user_id]
    );

    console.log(insertResult, updateResult);

    if (
      insertResult[0].affectedRows === 0 ||
      updateResult[0].affectedRows === 0
    ) {
      return null;
    }

    const createdHabit = await getCreatedHabitById(lastInsertId);
    return createdHabit;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const createFrequency = async (frequency: string, user_id: number) => {
  try {
    console.log(frequency, 'frequency');
    const updateResult = await promisePool.execute<ResultSetHeader>(
      'UPDATE Users SET habit_frequency = ? WHERE user_id = ?',
      [+frequency, user_id]
    );

    console.log(updateResult, updateResult[0].affectedRows);

    if (updateResult[0].affectedRows === 0) {
      return null;
    }

    const getFrequency = await getUserById(user_id);
    if (!getFrequency) {
      return null;
    }
    return getFrequency.habit_frequency;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const updateHabit = async (
  habit_id: number,
  user_id: number
) => {
  try {
    const updateResult = await promisePool.execute<ResultSetHeader>(
      'UPDATE Users SET habit_id = ? WHERE user_id = ?',
      [+habit_id, user_id]
    );

    if (updateResult[0].affectedRows === 0) {
      return null;
    }

    const updatedHabit = await getHabitById(+habit_id);
    return updatedHabit;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const addHabitDate = async (habit_id: number, user_id: number, completed_date: string): Promise<MessageResponse> => {
  try {
    const insertResult = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO HabitDates (habit_id, user_id, completed_date) VALUES (?, ?, ?)',
      [habit_id, user_id, completed_date]
    );

    if (insertResult[0].affectedRows === 0) {
      throw new Error('Date not added');
    }
    const response: MessageResponse = {
      message: 'Date added',
    };
    return response;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getHabitDates = async (habit_id: number, user_id: number): Promise<string[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & string[]>(
      'SELECT HabitDates.completed_date FROM HabitDates WHERE HabitDates.habit_id = ? AND HabitDates.user_id = ?',
      [habit_id, user_id]
    );
    if (result.length === 0) {
      return null;
    }
    const dates = result.map((row: any) => row.completed_date);
    console.log(dates, 'dates');
    return dates;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export {
  getCreatedHabits,
  getCreatedHabitById,
  createHabit,
  getHabits,
  getHabitById,
  createFrequency,
  updateHabit,
  addHabitDate,
  getHabitDates,
};
