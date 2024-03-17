import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {PutUserValues, UnauthorizedUser, User} from '@sharedTypes/DBTypes';
import {UserDeleteResponse} from '@sharedTypes/MessageTypes';

const getUsers = async (): Promise<UnauthorizedUser[] | null> => {
  try {
    const [result] = await promisePool.execute<
      RowDataPacket[] & UnauthorizedUser[]
    >(
      'SELECT Users.user_id, Users.username, Users.email, Users.created_at, Users.habit_frequency, Users.habit_id, Habits.habit_name FROM Users LEFT JOIN Habits ON Users.habit_id = Habits.habit_id'
    );
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getUserById = async (id: number): Promise<UnauthorizedUser | null> => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] & UnauthorizedUser[]
    >(
      'SELECT Users.user_id, Users.username, Users.email, Users.created_at, Users.habit_frequency, Users.habit_id, Habits.habit_name FROM Users LEFT JOIN Habits ON Users.habit_id = Habits.habit_id WHERE Users.user_id = ?',
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getUserById', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & User[]>(
      'SELECT Users.user_id, Users.username, Users.email, Users.password, Users.created_at FROM Users WHERE Users.username = ?',
      [username]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getUserByUsername', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & User[]>(
      'SELECT Users.user_id, Users.username, Users.email, Users.password, Users.created_at FROM Users WHERE Users.email = ?',
      [email]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getUserByEmail', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const createUser = async (user: User) => {
  try {
    const result = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
      [user.username, user.email, user.password]
    );
    console.log(user);
    if (result[0].affectedRows === 0) {
      return null;
    }
    const createdUser = await getUserById(result[0].insertId);
    return createdUser;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const updateUser = async (user: PutUserValues, id: number) => {
  try {
    console.log(user, id, 'updateUser');

    const userToUpdate: PutUserValues = {};
    if (user.email !== null) userToUpdate.email = user.email;
    if (user.username !== null) userToUpdate.username = user.username;
    if (user.password !== null) userToUpdate.password = user.password;

    const sql = promisePool.format('UPDATE Users SET ? WHERE user_id = ?', [
      userToUpdate,
      id,
    ]);

    console.log(sql, 'sql');

    const result = await promisePool.execute<ResultSetHeader>(sql);

    if (result[0].affectedRows === 0) {
      return null;
    }

    const updatedUser = await getUserById(id);
    return updatedUser;
  } catch (e) {
    console.error('updateUser', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const removeUser = async (id: number): Promise<UserDeleteResponse | null> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM Achieved WHERE user_id = ?', [id]);
    await connection.execute('DELETE FROM CreatedHabits WHERE user_id = ?', [
      id,
    ]);
    await connection.execute('DELETE FROM Posts WHERE user_id = ?', [id]);
    await connection.execute('DELETE FROM UserReflections WHERE user_id = ?', [
      id,
    ]);
    // add comments and likes
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Users WHERE user_id = ?',
      [id]
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      return null;
    }
    console.log(result, 'result');
    return {message: 'User deleted', user: {user_id: id}};
  } catch (e) {
    await connection.rollback();
    throw new Error((e as Error).message);
  } finally {
    connection.release();
  }
};

export {
  getUsers,
  getUserById,
  createUser,
  getUserByUsername,
  updateUser,
  removeUser,
  getUserByEmail,
};
