import express from 'express';
import {
  deleteComment,
  getAllComments,
  getCommentsCountForPost,
  getCommentsForPost,
  getCommentsOfUser,
  postComment,
  updateComment,
} from '../controllers/commentController';
import {authenticate, validationErrors} from '../../middlewares';
import {body} from 'express-validator';

const commentRouter = express.Router();

commentRouter
  .route('/')
  /**
   * @api {get} /comments Get all comments
   * @apiName GetComments
   * @apiGroup Comments
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiSuccess (200) {Object[]} comments List of comments
   * @apiSuccess (200) {Number} comments.comment_id Comment id
   * @apiSuccess (200) {Number} comments.post_id Post id
   * @apiSuccess (200) {Number} comments.user_id User id
   * @apiSuccess (200) {String} comments.comment_text Comment text
   * @apiSuccess (200) {String} comments.created_at Created at
   * @apiSuccess (200) {String} comments.username Username
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "comment_id": 1,
   *   "post_id": 1,
   *   "user_id": 1,
   *   "comment_text": "This is a comment",
   *   "created_at": "2021-08-01T00:00:00.000Z",
   *   "username": "user1"
   *  },
   *  {
   *   "comment_id": 2,
   *   "post_id": 2,
   *   "user_id": 1,
   *   "comment_text": "This is another comment",
   *   "created_at": "2021-08-01T00:00:00.000Z",
   *   "username": "user1"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No comments found"
   * }
   *
   */
  .get(getAllComments)
  /**
   * @api {post} /comments Create a new comment
   * @apiName CreateComment
   * @apiGroup Comments
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {String} comment_text Comment text
   * @apiParam  {Number} post_id Post id
   * @apiParam  {String} created_at Created at
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess (201) {String} message Comment created
   * @apiSuccess (201) {Object} comment Comment
   * @apiSuccess (201) {Number} comment.comment_id Comment id
   * @apiSuccess (201) {Number} comment.post_id Post id
   * @apiSuccess (201) {Number} comment.user_id User id
   * @apiSuccess (201) {String} comment.comment_text Comment text
   * @apiSuccess (201) {String} comment.created_at Created at
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Comment created",
   *  "comment": {
   *     "comment_id": 1,
   *     "post_id": 1,
   *     "user_id": 1,
   *     "comment_text": "This is a comment",
   *     "created_at": "2021-08-01T00:00:00.000Z"
   *   }
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Comment not created"
   * }
   */
  .post(
    authenticate,
    body('comment_text').isString().isLength({min: 1, max: 255}),
    body('post_id').isInt({min: 1}),
    validationErrors,
    postComment,
  );

commentRouter
  .route('/bypost/:id')
  /**
   * @api {get} /comments/bypost/:id Get comments by post id
   * @apiName GetCommentsByPostId
   * @apiGroup Comments
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiParam  {Number} id Post id
   * @apiSuccess (200) {Object[]} comments List of comments
   * @apiSuccess (200) {Number} comments.comment_id Comment id
   * @apiSuccess (200) {Number} comments.post_id Post id
   * @apiSuccess (200) {Number} comments.user_id User id
   * @apiSuccess (200) {String} comments.comment_text Comment text
   * @apiSuccess (200) {String} comments.created_at Created at
   * @apiSuccess (200) {String} comments.username Username
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "comment_id": 1,
   *   "post_id": 1,
   *   "user_id": 1,
   *   "comment_text": "This is a comment",
   *   "created_at": "2021-08-01T00:00:00.000Z",
   *   "username": "user1"
   *  },
   *  {
   *   "comment_id": 2,
   *   "post_id": 2,
   *   "user_id": 1,
   *   "comment_text": "This is another comment",
   *   "created_at": "2021-08-01T00:00:00.000Z",
   *   "username": "user1"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No comments found"
   * }
   */
  .get(getCommentsForPost);

commentRouter
  .route('/byuser/:id')
  /**
   * @api {get} /comments/byuser/:id Get comments by user id
   * @apiName GetCommentsByUserId
   * @apiGroup Comments
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiParam  {Number} id User id
   * @apiSuccess (200) {Object[]} comments List of comments
   * @apiSuccess (200) {Number} comments.comment_id Comment id
   * @apiSuccess (200) {Number} comments.post_id Post id
   * @apiSuccess (200) {Number} comments.user_id User id
   * @apiSuccess (200) {String} comments.comment_text Comment text
   * @apiSuccess (200) {String} comments.created_at Created at
   * @apiSuccess (200) {String} comments.username Username
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "comment_id": 1,
   *   "post_id": 1,
   *   "user_id": 1,
   *   "comment_text": "This is a comment",
   *   "created_at": "2021-08-01T00:00:00.000Z",
   *   "username": "user1"
   *  },
   *  {
   *   "comment_id": 2,
   *   "post_id": 2,
   *   "user_id": 1,
   *   "comment_text": "This is another comment",
   *   "created_at": "2021-08-01T00:00:00.000Z",
   *   "username": "user1"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No comments found"
   * }
   */
  .get(getCommentsOfUser);

commentRouter
  .route('/count/:id')
  /**
   * @api {get} /comments/count/:id Get comments count by post id
   * @apiName GetCommentsCountByPostId
   * @apiGroup Comments
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiParam  {Number} id Post id
   * @apiSuccess (200) {Number} count Comment count
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "count": 2
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No comments found"
   * }
   */
  .get(getCommentsCountForPost);

commentRouter
  .route('/:id')
  /**
   * @api {delete} /comments/:id Delete a comment
   * @apiName DeleteComment
   * @apiGroup Comments
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {Number} id Comment id
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess (200) {String} message Comment deleted
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Comment deleted"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Comment not deleted"
   * }
   */
  .delete(authenticate, deleteComment)
  /**
   * @api {put} /comments/:id Update a comment
   * @apiName UpdateComment
   * @apiGroup Comments
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {Number} id Comment id
   * @apiParam  {String} comment_text Comment text
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess (200) {String} message Comment updated
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Comment updated"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Comment not updated"
   * }
   */
  .put(authenticate, updateComment);
export default commentRouter;
