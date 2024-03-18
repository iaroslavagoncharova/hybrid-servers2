import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Comment, CommentWithOwner} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getComments = async (): Promise<CommentWithOwner[] | null> => {
  try {
    const [rows] = await promisePool.query<
      RowDataPacket[] & CommentWithOwner[]
    >(
      'SELECT comments.*, Users.username FROM Comments JOIN Users ON Comments.user_id = Users.user_id;',
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('getComments error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const getCommentsByPostId = async (
  id: number,
): Promise<CommentWithOwner[] | null> => {
  try {
    const [rows] = await promisePool.query<
      RowDataPacket[] & CommentWithOwner[]
    >(
      'SELECT comments.*, Users.username FROM Comments JOIN Users ON Comments.user_id = Users.user_id WHERE Comments.post_id = ?;',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('getCommentsByPostId error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const getCommentsCountByPostId = async (id: number): Promise<number | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
      'SELECT COUNT(*) as commentCount FROM Comments WHERE post_id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    console.log('rows[0].commentCount', rows[0].commentCount, id);
    return rows[0].commentCount;
  } catch (error) {
    console.error('getCommentsCountForPost error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const getCommentsByUserId = async (id: number): Promise<Comment[] | null> => {
  try {
    const [rows] = await promisePool.query<RowDataPacket[] & Comment[]>(
      'SELECT * FROM Comments WHERE user_id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('getCommentsByUserId error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const createComment = async (
  comment: Omit<Comment, 'comment_id' | 'created_at'>,
): Promise<Comment | null> => {
  console.log('comment', comment);
  const sql =
    'INSERT INTO Comments (post_id, user_id, comment_text) VALUES (?, ?, ?)';
  const params = [comment.post_id, comment.user_id, comment.comment_text];
  try {
    const result = await promisePool.query<ResultSetHeader>(sql, params);
    const [rows] = await promisePool.query<RowDataPacket[] & Comment[]>(
      'SELECT * FROM Comments WHERE comment_id = ?',
      [result[0].insertId],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error('createComment error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const deleteCommentById = async (
  comment_id: number,
  user_id: number,
): Promise<MessageResponse> => {
  try {
    const [rows] = await promisePool.query<ResultSetHeader>(
      'DELETE FROM Comments WHERE comment_id = ? AND user_id = ?',
      [comment_id, user_id],
    );
    if (rows.affectedRows === 0) {
      throw new Error('Comment not deleted');
    }
    return {message: 'Comment deleted'};
  } catch (error) {
    console.error('deleteCommentById error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const putComment = async (
  comment_id: number,
  user_id: number,
  comment_text: string,
): Promise<MessageResponse | null> => {
  try {
    const [rows] = await promisePool.query<ResultSetHeader>(
      'UPDATE Comments SET comment_text = ? WHERE comment_id = ? AND user_id = ?',
      [comment_text, comment_id, user_id],
    );
    if (rows.affectedRows === 0) {
      return null;
    }
    return {message: 'Comment updated'};
  } catch (error) {
    console.error('putComment error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

export {
  getComments,
  getCommentsByPostId,
  getCommentsCountByPostId,
  getCommentsByUserId,
  createComment,
  deleteCommentById,
  putComment,
};
