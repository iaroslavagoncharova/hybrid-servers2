import {Like} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getAllLikes = async (): Promise<Like[] | null> => {
  try {
    const [rows] = await promisePool.query<RowDataPacket[] & Like[]>(
      'SELECT * FROM Likes',
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('getAllLikes error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const postLike = async (
  post_id: number,
  user_id: number,
): Promise<MessageResponse | null> => {
  try {
    const [existingLike] = await promisePool.execute<RowDataPacket[] & Like[]>(
      'SELECT * FROM Likes WHERE user_id = ? AND post_id = ?',
      [user_id, post_id],
    );
    if (existingLike.length !== 0) {
      return null;
    }
    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Likes (user_id, post_id) VALUES (?, ?)',
      [user_id, post_id],
    );

    console.log('result', result);

    if (result.affectedRows === 0) {
      return null;
    }

    return {message: 'Like created'};
  } catch (e) {
    console.error('postLike error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getLikesCount = async (id: number): Promise<number | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
      'SELECT COUNT(*) as likeCount FROM Likes WHERE post_id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0].likeCount;
  } catch (error) {
    console.error('getLikesCount error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const getLikesByPost = async (id: number): Promise<Like[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
      'SELECT * FROM Likes WHERE post_id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('getLikesByPost error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const getLikeByUser = async (user_id: number): Promise<Like[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
      'SELECT * FROM Likes WHERE user_id = ?',
      [user_id],
    );
    if (rows.length === 0) {
      return null;
    }
    console.log('rows', rows[0]);
    return rows;
  } catch (error) {
    console.error('getLikeByUser error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const deleteLike = async (
  post_id: number,
  user_id: number,
): Promise<MessageResponse | null> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM Likes WHERE post_id = ? AND user_id = ?',
      [post_id, user_id],
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return {message: 'Like removed'};
  } catch (error) {
    console.error('deleteLike error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const fetchLikesByPostAndUser = async (
  post_id: number,
  user_id: number,
): Promise<Like> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
      'SELECT * FROM Likes WHERE post_id = ? AND user_id = ?',
      [post_id, user_id],
    );
    if (rows.length === 0) {
      throw new Error('No like found');
    }
    console.log('rows', rows[0], rows.length);
    return rows[0];
  } catch (error) {
    console.error('fetchLikesByPostAndUser error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

export {
  getAllLikes,
  postLike,
  getLikesCount,
  getLikeByUser,
  deleteLike,
  getLikesByPost,
  fetchLikesByPostAndUser,
};
