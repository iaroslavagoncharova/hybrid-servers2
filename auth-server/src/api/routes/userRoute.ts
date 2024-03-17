import express from 'express';
import {
  checkEmail,
  checkToken,
  checkUsername,
  deleteUser,
  getAllUsers,
  getUser,
  postUser,
  putUser,
} from '../controllers/userController';
import {body, param} from 'express-validator';
import {createUser, updateUser} from '../models/userModel';
import {authenticate} from '../../middlewares';

const userRoute = express.Router();

userRoute
  /**
   * @api {get} /users/ Get all users
   * @apiName GetAllUsers
   * @apiGroup User
   * @apiPermission all
   * @apiSuccess {Object[]} users List of all users
   * @apiSuccess {Number} users.user_id User id
   * @apiSuccess {String} users.username Username
   * @apiSuccess {String} users.email Email
   * @apiSuccess {String} users.created_at Date of creation
   * @apiSuccess {number} users.habit_frequency Frequency of habit
   * @apiSuccess {Number} users.habit_id Habit id
   * @apiSuccess {String} users.habit_name Name of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "user_id": 1,
   *   "username": "user1",
   *   "email": "user1@example.com",
   *   "created_at": "2021-01-01T00:00:00.000Z",
   *   "habit_frequency": 1,
   *   "habit_id": 1,
   *   "habit_name": "Read"
   *   },
   *   {
   *   "user_id": 2,
   *   "username": "user2",
   *   "email": "user2@example.com",
   *   "created_at": "2021-01-01T00:00:00.000Z",
   *   "habit_frequency": 2,
   *   "habit_id": 2,
   *   "habit_name": "Meditate"
   *   },
   * ]
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   */
  .get('/', getAllUsers);
userRoute
  /**
   * @api {get} /users/username/:username Check if username exists
   * @apiName CheckUsername
   * @apiGroup User
   * @apiPermission all
   * @apiParam {String} username Username
   * @apiSuccess {String} message Available: true
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": {"available": true}
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 400 Bad Request
   * {
   * "message": {"available": false}
   * }
   */
  .get(
    '/username/:username',
    param('username').isString().escape(),
    checkUsername
  );
userRoute
  /**
   * @api {get} /users/email/:email Check if email exists
   * @apiName CheckEmail
   * @apiGroup User
   * @apiPermission all
   * @apiParam {String} email Email
   * @apiSuccess {String} message Available: true
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": {"available": true}
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 400 Bad Request
   * {
   * "message": {"available": false}
   * }
   */
  .get('/email/:email', param('email').isEmail().normalizeEmail(), checkEmail);
userRoute
  /**
   * @api {get} /users/token Check token
   * @apiName CheckToken
   * @apiGroup User
   * @apiPermission user
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess {String} message Token is valid
   * @apiSuccess {Object} user User object
   * @apiSuccess {Number} user.user_id User id
   * @apiSuccess {String} user.username Username
   * @apiSuccess {String} user.email Email
   * @apiSuccess {String} user.created_at Date of creation
   * @apiSuccess {number} user.habit_frequency Frequency of habit
   * @apiSuccess {Number} user.habit_id Habit id
   * @apiSuccess {String} user.habit_name Name of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Token is valid",
   *    "user": {
   *    "user_id": 1,
   *    "username": "user1",
   *    "email": "user1@example.com",
   *    "created_at": "2021-01-01T00:00:00.000Z",
   *    "habit_frequency": 1,
   *    "habit_id": 1,
   *    "habit_name": "Read"
   * }
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 401 Unauthorized
   * {
   *   "message": "Invalid token"
   * }
   */
  .get('/token', authenticate, checkToken);
userRoute
  .route('/:id')
  /**
   * @api {get} /users/:id Get user by id
   * @apiName GetUser
   * @apiGroup User
   * @apiPermission user
   * @apiParam {Number} id User id
   * @apiSuccess {Object[]} user User object
   * @apiSuccess {Number} user.user_id User id
   * @apiSuccess {String} user.username Username
   * @apiSuccess {String} user.email Email
   *  @apiSuccess {String} user.created_at Date of creation
   * @apiSuccess {number} user.habit_frequency Frequency of habit
   * @apiSuccess {Number} user.habit_id Habit id
   * @apiSuccess {String} user.habit_name Name of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *   "user_id": 1,
   *   "username": "user1",
   *   "email": "user1@example.com",
   *   "created_at": "2021-01-01T00:00:00.000Z",
   *   "habit_frequency": 1,
   *   "habit_id": 1,
   *   "habit_name": "Read"
   *  }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *   "message": "User not found"
   * }
   */
  .get(param('id').isNumeric(), getUser);
userRoute
  /**
   * @api {post} /users/ Create user
   * @apiName CreateUser
   * @apiGroup User
   * @apiPermission all
   * @apiParam {String} username Username
   * @apiParam {String} email Email
   * @apiParam {String} password Password
   * @apiSuccess {String} message User created
   * @apiSuccess {Object[]} user User object
   * @apiSuccess {Number} user.user_id User id
   * @apiSuccess {String} user.username Username
   * @apiSuccess {String} user.email Email
   * @apiSuccess {String} user.created_at Date of creation
   * @apiSuccess {number} user.habit_frequency Frequency of habit
   * @apiSuccess {Number} user.habit_id Habit id
   * @apiSuccess {String} user.habit_name Name of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 201 Created
   * {
   *   "message": "User created"
   *   "user": {
   *     "user_id": 1,
   *     "username": "user1",
   *     "email": "user1@example.com",
   *     "created_at": "2021-01-01T00:00:00.000Z",
   *     "habit_frequency": 1,
   *     "habit_id": 1,
   *     "habit_name": "Read"
   *     }
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *    "message": "User not created"
   * }
   *
   */
  .post(
    '/',
    body('username')
      .notEmpty()
      .isString()
      .escape()
      .trim()
      .isLength({min: 3, max: 20}),
    body('email').isEmail().normalizeEmail().isString(),
    body('password')
      .isString()
      .notEmpty()
      .isLength({min: 8, max: 20})
      .isString()
      .escape()
      .trim(),
    postUser
  );
userRoute
  /**
   * @api {put} /users/ Update user
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission user
   * @apiHeader {String} Authorization Bearer token
   * @apiParam {String} [username] Username
   * @apiParam {String} [email] Email
   * @apiParam {String} [password] Password
   * @apiSuccess {String} message User updated
   * @apiSuccess {Object[]} user User object
   * @apiSuccess {Number} user.user_id User id
   * @apiSuccess {String} user.username Username
   * @apiSuccess {String} user.email Email
   * @apiSuccess {String} user.created_at Date of creation
   * @apiSuccess {number} user.habit_frequency Frequency of habit
   * @apiSuccess {Number} user.habit_id Habit id
   * @apiSuccess {String} user.habit_name Name of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *   "message": "User updated"
   *   "user": {
   *      "user_id": 1,
   *      "username": "user1",
   *      "email": "user1@example.com",
   *      "created_at": "2021-01-01T00:00:00.000Z",
   *      "habit_frequency": 1,
   *      "habit_id": 1,
   *      "habit_name": "Read"
   *     }
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *   "message": "User not updated"
   * }
   */
  .put(
    '/',
    authenticate,
    body('email').optional().isEmail(),
    body('username')
      .optional()
      .isString()
      .escape()
      .trim()
      .isLength({min: 3, max: 20}),
    body('password')
      .optional()
      .isString()
      .escape()
      .trim()
      .isLength({min: 8, max: 20}),
    putUser
  );
userRoute
  /**
   * @api {delete} /users/ Delete user
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission user
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess {String} message User deleted
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *   "message": "User deleted"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *   "message": "User not found or already deleted"
   * }
   */
  .delete('/', authenticate, deleteUser);
export default userRoute;
