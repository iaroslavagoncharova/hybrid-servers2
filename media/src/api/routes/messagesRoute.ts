import express from 'express';
import {fetchMessages} from '../controllers/messageController';

const messageRouter = express.Router();
messageRouter
  .route('/')
  /**
   * @api {get} /messages Get all messages
   * @apiName GetMessages
   * @apiGroup Messages
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiSuccess (200) {Object} messages Random message of the day
   * @apiSuccess (200) {Number} messages.message_id Message id
   * @apiSuccess (200) {String} messages.message_text Message text
   * @apiSuccess (200) {String} messages.message_author Message author
   * @apiSuccess (200) {String} messages.last_used_date Last used date
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message_id": 1,
   *  "message_text": "Rise and shine",
   *  "message_author": "Anonymous",
   *  "last_used_date": "2021-08-01T00:00:00.000Z"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No messages found"
   * }
   *
   */
  .get(fetchMessages);

export default messageRouter;
