import express from 'express';
import {body} from 'express-validator';
import { login } from '../controllers/authController';


const authRoute = express.Router();

authRoute
/**
 * @api {post} /auth/login Login
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission User
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiSuccess {String} message Logged in
 * @apiSuccess {String} token Token
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
 *   "message": "Logged in",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
 *   "user": {
 *     "user_id": 1,
 *     "username": "user1",
 *     "email": "user1@example.com",
 *     "created_at": "2021-01-01T00:00:00.000Z",
 *     "habit_frequency": 1,
 *     "habit_id": 1,
 *     "habit_name": "Read"
 *    }
 * }
 * @apiErrorExample {json} Error
 * HTTP/1.1 401 Unauthorized
 * {
 *   "message": "Invalid username or the user doesn't exist"
 * }
 * @apiErrorExample {json} Error
 * HTTP/1.1 401 Unauthorized
 * {
 *   "message": "Invalid password"
 * }
 * @apiErrorExample {json} Error
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Error logging in"
 * }
 */
.post('/login', body('username').isString().notEmpty().isLength({min: 3, max: 20}),
body('password').isLength({min: 8, max: 20}).isString().notEmpty(),
 login);

export default authRoute;
