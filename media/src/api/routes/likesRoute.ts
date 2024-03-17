import express from 'express';
import {
  createLike,
  getCount,
  getLikeByPostAndUser,
  getLikeByPostId,
  getLikeByUserId,
  getLikes,
  removeLike,
} from '../controllers/likesController';
import {authenticate, validationErrors} from '../../middlewares';
import {body} from 'express-validator';

const likesRouter = express.Router();

likesRouter
  .route('/')
  /**
   * @api {get} /likes Get all likes
   * @apiName GetLikes
   * @apiGroup Likes
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiSuccess (200) {Object[]} likes List of likes
   * @apiSuccess (200) {Number} likes.like_id Like id
   * @apiSuccess (200) {Number} likes.post_id Post id
   * @apiSuccess (200) {Number} likes.user_id User id
   * @apiSuccess (200) {String} likes.created_at Created at
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "like_id": 1,
   *   "post_id": 1,
   *   "user_id": 1,
   *   "created_at": "2021-08-01T00:00:00.000Z"
   *  },
   *  {
   *   "like_id": 2,
   *   "post_id": 2,
   *   "user_id": 1,
   *   "created_at": "2021-08-01T00:00:00.000Z"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No likes found"
   * }
   */
  .get(getLikes)
  /**
   * @api {post} /likes Create a new like
   * @apiName CreateLike
   * @apiGroup Likes
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {Number} post_id Post id
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess (201) {String} message Like created
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Like created"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Like not created"
   * }
   */
  .post(
    authenticate,
    body('post_id').notEmpty().isInt(),
    validationErrors,
    createLike,
  );

likesRouter
  .route('/bypost/:id')
  /*
   * @api {get} /likes/bypost/:id Get likes by post id
   * @apiName GetLikesByPostId
   * @apiGroup Likes
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiParam  {Number} id Post id
   * @apiSuccess (200) {Object[]} likes List of likes
   * @apiSuccess (200) {Number} likes.like_id Like id
   * @apiSuccess (200) {Number} likes.post_id Post id
   * @apiSuccess (200) {Number} likes.user_id User id
   * @apiSuccess (200) {String} likes.created_at Created at
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "like_id": 1,
   *   "post_id": 1,
   *   "user_id": 1,
   *   "created_at": "2021-08-01T00:00:00.000Z"
   *  },
   *  {
   *   "like_id": 2,
   *   "post_id": 1,
   *   "user_id": 2,
   *   "created_at": "2021-08-01T00:00:00.000Z"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No likes found"
   * }
   */
  .get(getLikeByPostId);

likesRouter
  .route('/bypost/user/:id')
  /*
   * @api {get} /likes/bypost/user/:id Get like by post and user
   * @apiName GetLikeByPostAndUser
   * @apiGroup Likes
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {Number} id Post id
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess (200) {Object} like Like object
   * @apiSuccess (200) {Number} like.like_id Like id
   * @apiSuccess (200) {Number} like.post_id Post id
   * @apiSuccess (200) {Number} like.user_id User id
   * @apiSuccess (200) {String} like.created_at Created at
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "like_id": 1,
   *  "post_id": 1,
   *  "user_id": 1,
   *  "created_at": "2021-08-01T00:00:00.000Z"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No like found"
   * }
   */
  .get(authenticate, getLikeByPostAndUser);

likesRouter
  .route('/byuser/:id')
  /*
   * @api {get} /likes/byuser/:id Get likes by user id
   * @apiName GetLikesByUserId
   * @apiGroup Likes
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {Number} id User id
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess (200) {Object[]} likes List of likes
   * @apiSuccess (200) {Number} likes.like_id Like id
   * @apiSuccess (200) {Number} likes.post_id Post id
   * @apiSuccess (200) {Number} likes.user_id User id
   * @apiSuccess (200) {String} likes.created_at Created at
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "like_id": 1,
   *   "post_id": 1,
   *   "user_id": 1,
   *   "created_at": "2021-08-01T00:00:00.000Z"
   *  },
   *  {
   *   "like_id": 2,
   *   "post_id": 2,
   *   "user_id": 1,
   *   "created_at": "2021-08-01T00:00:00.000Z"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No likes found"
   * }
   */
  .get(authenticate, getLikeByUserId);

likesRouter
  .route('/:id')
  /**
   * @api {delete} /likes/:id Remove a like
   * @apiName RemoveLike
   * @apiGroup Likes
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {Number} id Like id
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess (200) {String} message Like removed
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Like removed"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Like not deleted"
   * }
   */
  .delete(authenticate, removeLike);

likesRouter
  .route('/count/:id')
  /**
   * @api {get} /likes/count/:id Get likes count by post id
   * @apiName GetLikesCount
   * @apiGroup Likes
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiParam  {Number} id Post id
   * @apiSuccess (200) {Number} count Likes count
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "count": 2
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No likes found"
   * }
   */
  .get(getCount);

export default likesRouter;
