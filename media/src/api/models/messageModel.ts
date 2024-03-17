import {RowDataPacket} from 'mysql2';
import promisePool from '../../lib/db';
import {Message} from '@sharedTypes/DBTypes';

const getAllMessages = async (): Promise<Message | null> => {
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [result] = await promisePool.query<RowDataPacket[] & Message[]>(
    'SELECT * FROM messages WHERE last_used_date IS NULL OR last_used_date < ? ORDER BY RAND() LIMIT 1',
    [currentDate]
  );
  if (result[0].length === 0) {
    return null;
  }
  const updateDates = await promisePool.query(
    'UPDATE messages SET last_used_date = ? WHERE message_id = ?',
    [currentDate, result[0].message_id]
  );
  return result[0];
};

export {getAllMessages};
