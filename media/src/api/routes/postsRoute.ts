import express from 'express';
import {
  createPost,
  getPost,
  getPostsList,
  removePost,
  updatePost,
} from '../controllers/postsController';
import {authenticate, validationErrors} from '../../middlewares';
import {body} from 'express-validator';
const postsRouter = express.Router();

postsRouter
  .route('/')
  /**
   * @api {get} /posts Get all posts
   * @apiName GetPosts
   * @apiGroup Posts
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiSuccess (200) {Object[]} posts List of posts
   * @apiSuccess (200) {Number} posts.post_id Post id
   * @apiSuccess (200) {Number} posts.user_id User id
   * @apiSuccess (200) {String} posts.post_title Post title
   * @apiSuccess (200) {String} posts.post_text Post text
   * @apiSuccess (200) {String} posts.filename Filename
   * @apiSuccess (200) {String} posts.media_type Media type
   * @apiSuccess (200) {Number} posts.filesize Filesize
   * @apiSuccess (200) {String} posts.created_at Created at
   * @apiSuccess (200) {String} posts.username Username
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "post_id": 1,
   *   "user_id": 1,
   *   "post_title": "This is a post",
   *   "post_text": "This is the text of the post",
   *   "filename": "file1.jpg",
   *   "media_type": "image/jpeg",
   *   "filesize": 1000,
   *   "created_at": "2021-08-01T00:00:00.000Z",
   *   "username": "user1"
   *  },
   *  {
   *   "post_id": 2,
   *   "user_id": 1,
   *   "post_title": "This is another post",
   *   "post_text": "This is the text of another post",
   *   "filename": "file2.jpg",
   *   "media_type": "image/jpeg",
   *   "filesize": 2000,
   *   "created_at": "2021-08-01T00:00:00.000Z",
   *   "username": "user1"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No posts found"
   * }
   */
  .get(getPostsList)
  /**
   * @api {post} /posts Create a new post
   * @apiName CreatePost
   * @apiGroup Posts
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {String} post_title Post title
   * @apiParam  {String} post_text Post text
   * @apiParam  {String} filename Filename
   * @apiParam  {String} media_type Media type
   * @apiParam  {Number} filesize Filesize
   * @apiSuccess (201) {String} message Post created
   * @apiSuccess (201) {Object} post Post
   * @apiSuccess (201) {Number} post.post_id Post id
   * @apiSuccess (201) {Number} post.user_id User id
   * @apiSuccess (201) {String} post.post_title Post title
   * @apiSuccess (201) {String} post.post_text Post text
   * @apiSuccess (201) {String} post.filename Filename
   * @apiSuccess (201) {String} post.media_type Media type
   * @apiSuccess (201) {Number} post.filesize Filesize
   * @apiSuccess (201) {String} post.created_at Created at
   * @apiSuccess (201) {String} post.username Username
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Post created",
   *  "post": {
   *      "post_id": 1,
   *      "user_id": 1,
   *      "post_title": "This is a post",
   *      "post_text": "This is the text of the post",
   *      "filename": "file1.jpg",
   *      "media_type": "image/jpeg",
   *      "filesize": 1000,
   *      "created_at": "2021-08-01T00:00:00.000Z",
   *      "username": "user1"
   *   }
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Post not created"
   * }
   *
   */
  .post(
    authenticate,
    body('post_title').notEmpty().isString().escape(),
    body('post_text').notEmpty().isString().escape(),
    body('filename').notEmpty().isString().escape(),
    body('media_type').notEmpty().isString().escape(),
    body('filesize').notEmpty().isNumeric().escape(),
    validationErrors,
    createPost,
  );

postsRouter
  .route('/:id')
  /**
   * @api {get} /posts/:id Get a post
   * @apiName GetPost
   * @apiGroup Posts
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiParam  {Number} id Post id
   * @apiSuccess (200) {Object} post Post
   * @apiSuccess (200) {Number} post.post_id Post id
   * @apiSuccess (200) {Number} post.user_id User id
   * @apiSuccess (200) {String} post.post_title Post title
   * @apiSuccess (200) {String} post.post_text Post text
   * @apiSuccess (200) {String} post.filename Filename
   * @apiSuccess (200) {String} post.media_type Media type
   * @apiSuccess (200) {Number} post.filesize Filesize
   * @apiSuccess (200) {String} post.created_at Created at
   * @apiSuccess (200) {String} post.username Username
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "post_id": 1,
   *  "user_id": 1,
   *  "post_title": "This is a post",
   *  "post_text": "This is the text of the post",
   *  "filename": "file1.jpg",
   *  "media_type": "image/jpeg",
   *  "filesize": 1000,
   *  "created_at": "2021-08-01T00:00:00.000Z",
   *  "username": "user1"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No post found"
   * }
   */
  .get(getPost)
  /**
   * @api {put} /posts/:id Update a post
   * @apiName UpdatePost
   * @apiGroup Posts
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {Number} id Post id
   * @apiParam  {String} post_title Post title
   * @apiParam  {String} post_text Post text
   * @apiSuccess (200) {String} message Post updated
   * @apiSuccess (200) {Object} post Post
   * @apiSuccess (200) {Number} post.post_id Post id
   * @apiSuccess (200) {Number} post.user_id User id
   * @apiSuccess (200) {String} post.post_title Post title
   * @apiSuccess (200) {String} post.post_text Post text
   * @apiSuccess (200) {String} post.filename Filename
   * @apiSuccess (200) {String} post.media_type Media type
   * @apiSuccess (200) {Number} post.filesize Filesize
   * @apiSuccess (200) {String} post.created_at Created at
   * @apiSuccess (200) {String} post.username Username
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Post updated",
   *  "post": {
   *     "post_id": 1,
   *     "user_id": 1,
   *     "post_title": "This is a post",
   *     "post_text": "This is the text of the post",
   *     "filename": "file1.jpg",
   *     "media_type": "image/jpeg",
   *     "filesize": 1000,
   *     "created_at": "2021-08-01T00:00:00.000Z",
   *     "username": "user1"
   *   }
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Post not updated"
   * }
   */
  .put(
    authenticate,
    body('post_title').optional().isString().escape(),
    body('post_text').optional().isString().escape(),
    validationErrors,
    updatePost,
  )
  /**
   * @api {delete} /posts/:id Delete a post
   * @apiName DeletePost
   * @apiGroup Posts
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiParam  {Number} id Post id
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess (200) {String} message Post deleted
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Post deleted"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Post not deleted"
   * }
   */
  .delete(authenticate, removePost);

export default postsRouter;
