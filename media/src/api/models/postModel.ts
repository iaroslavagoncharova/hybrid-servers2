/* eslint-disable quotes */
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Post, PostWithOwner} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getAllPosts = async (): Promise<PostWithOwner[] | null> => {
  const uploadUrl = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.query<RowDataPacket[] & PostWithOwner[]>(
      `SELECT p.*,
      CONCAT(? , p.filename) AS filename,
      CONCAT(?, CONCAT(p.filename, "-thumb.png")) AS thumbnail,
      u.username AS username
      FROM Posts p
      JOIN Users u ON p.user_id = u.user_id
      ORDER BY p.created_at DESC`,
      [uploadUrl, uploadUrl],
    );
    if (rows.length === 0) {
      return [];
    }
    return rows;
  } catch (error) {
    console.error('getAllPosts error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const getPostById = async (id: number): Promise<Post | null> => {
  const uploadUrl = process.env.UPLOAD_URL;
  try {
    const sql = `SELECT *, CONCAT(? , filename) AS filename, CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail FROM posts WHERE post_id = ?`;
    const params = [uploadUrl, uploadUrl, id];
    const [rows] = await promisePool.query<RowDataPacket[] & Post[]>(
      sql,
      params,
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error('getPostById error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const postPost = async (
  post: Omit<Post, 'post_id' | 'created_at' | 'thumbnail'>,
): Promise<Post | null> => {
  const {user_id, post_title, post_text, filename, filesize, media_type} = post;
  const sql = `INSERT INTO Posts (user_id, post_title, post_text, filename, filesize, media_type) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    user_id,
    post_title,
    post_text,
    filename,
    filesize,
    media_type,
  ];
  console.log(post, sql, params);
  try {
    const result = await promisePool.query<ResultSetHeader>(sql, params);
    const [rows] = await promisePool.query<RowDataPacket[] & Post[]>(
      `SELECT * FROM posts WHERE post_id = ?`,
      [result[0].insertId],
    );
    console.log('rows', rows);
    console.log('result', result);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error('postPost error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const putPost = async (
  post: Pick<Post, 'post_title' | 'post_text'>,
  id: number,
  user_id: number,
): Promise<Post | null> => {
  try {
    const {post_title, post_text} = post;
    let sql = ``;
    let params: (string | number)[] = [];
    if (post_title && post_text) {
      sql = `UPDATE posts SET post_title = ?, post_text = ? WHERE post_id = ? AND user_id = ?`;
      params = [post_title, post_text, id, user_id];
    } else if (post_title) {
      sql = `UPDATE posts SET post_title = ? WHERE post_id = ? AND user_id = ?`;
      params = [post_title, id, user_id];
    } else if (post_text) {
      sql = `UPDATE posts SET post_text = ? WHERE post_id = ? AND user_id = ?`;
      params = [post_text, id, user_id];
    }
    console.log('sql', sql);
    const result = await promisePool.execute<ResultSetHeader>(sql, params);
    console.log('result', result);
    if (result[0].affectedRows === 0) {
      return null;
    }

    const postResult = await getPostById(id);
    if (!postResult) {
      return null;
    }
    return postResult;
  } catch (error) {
    console.error('putPost error', (error as Error).message);
    throw new Error((error as Error).message);
  }
};

const deletePost = async (
  post_id: number,
  user_id: number,
  token: string,
): Promise<MessageResponse> => {
  console.log('post_id', post_id, 'user_id', user_id, 'token', token);
  const post = await getPostById(post_id);
  if (!post) {
    throw new Error('Post not found');
  }

  post.filename = post?.filename.replace(process.env.UPLOAD_URL as string, '');

  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();
    // add likes and comments delete
    const sql = connection.format(
      `DELETE FROM posts WHERE post_id = ? AND user_id = ?`,
      [post_id, user_id],
    );

    console.log('sql', sql);

    const result = await connection.execute<ResultSetHeader>(sql);

    if (result[0].affectedRows === 0) {
      throw new Error('Post not deleted');
    }

    const options = {
      menthod: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    try {
      const deleteResult = await fetchData<MessageResponse>(
        `${process.env.UPLOAD_SERVER}/delete/${post.filename}`,
        options,
      );

      console.log('deleteResult', deleteResult);
    } catch (error) {
      console.error('deletePost fetchData error', (error as Error).message);
    }

    await connection.commit();

    return {message: 'Post deleted'};
  } catch (error) {
    await connection.rollback();
    console.error('deletePost error', (error as Error).message);
    throw new Error((error as Error).message);
  } finally {
    connection.release();
  }
};

export {getAllPosts, getPostById, postPost, putPost, deletePost};
