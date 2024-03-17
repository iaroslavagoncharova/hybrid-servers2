import {Prompt, Reflection, ReflectionWithPrompt} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getReflectionsByUser = async (
  id: number
): Promise<ReflectionWithPrompt[] | null> => {
  try {
    const [rows] = await promisePool.query<
      RowDataPacket[] & ReflectionWithPrompt[]
    >(
      'SELECT * FROM userreflections LEFT JOIN reflectionprompts ON userreflections.prompt_id = reflectionprompts.prompt_id WHERE user_id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    console.log('rows', rows);
    return rows;
  } catch (error) {
    console.error('getReflectionsByUser error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const getAllReflections = async (): Promise<Reflection[] | null> => {
  try {
    const [rows] = await promisePool.query<RowDataPacket[] & Reflection[]>(
      'SELECT * FROM userreflections'
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('getAllReflections error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const createReflection = async (
  reflection_text: string,
  user_id: number,
  prompt_id: number
): Promise<MessageResponse | null> => {
  const params = [reflection_text, user_id, prompt_id];
  const sql =
    'INSERT INTO userreflections (reflection_text, user_id, prompt_id) VALUES (?, ?, ?)';
  try {
    const result = await promisePool.query<ResultSetHeader>(sql, params);
    const [rows] = await promisePool.query<RowDataPacket[] & Reflection[]>(
      'SELECT * FROM userreflections WHERE reflection_id = ?',
      [result[0].insertId]
    );
    if (rows.length === 0) {
      return null;
    }
    console.log('rows', rows);
    return {message: 'Reflection added'};
  } catch (error) {
    console.error('createReflection error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const fetchPrompts = async (): Promise<Prompt[] | null> => {
  try {
    const [rows] = await promisePool.query<RowDataPacket[] & Prompt[]>(
      'SELECT * FROM reflectionprompts'
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('fetchPrompts error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

export {
  getReflectionsByUser,
  createReflection,
  getAllReflections,
  fetchPrompts,
};
