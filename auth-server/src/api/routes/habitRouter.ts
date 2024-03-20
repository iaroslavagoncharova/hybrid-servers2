import express from 'express';
import {
  getAllHabits,
  getHabit,
  getCreatedHabit,
  getAllCreatedHabits,
  postHabit,
  postFrequency,
  putHabit,
  postDates,
  getDates,
} from '../controllers/habitController';
import {authenticate} from '../../middlewares';

const habitRoute = express.Router();

habitRoute
  /**
   * @api {get} /habits/dates/:id Get user's completed dates by habit id
   * @apiName GetDates
   * @apiGroup Habit
   * @apiPermission user
   * @apiHeader {String} Authorization Bearer token
   * @apiParam {Number} id Habit id
   * @apiSuccess {String[]} dates List of completed dates
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * [
   *  "2024-03-20",
   *  "2024-03-19",
   *  "2024-03-18",
   * ]
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Dates not found"
   * }
   *
   */
  .get('/dates/:id', authenticate, getDates)
  /**
   * @api {post} /habits/dates/:id Add user's completed date by habit id
   * @apiName PostDates
   * @apiGroup Habit
   * @apiPermission user
   * @apiHeader {String} Authorization Bearer token
   * @apiParam {Number} id Habit id
   * @apiParam {String} date Completed date
   * @apiParamExample {json} Input
   * {
   *  "date": "2024-03-20",
   *  "habit_id": 1,
   * }
   * @apiSuccess {String} message Date added
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Date added",
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Date not added"
   * }
   */
  .post('/dates/:id', authenticate, postDates);
habitRoute
  /**
   * @api {get} /habits/ Get all habits
   * @apiName GetAllHabits
   * @apiGroup Habit
   * @apiPermission all
   * @apiSuccess {Object[]} habits List of all habits
   * @apiSuccess {Number} habits.habit_id Habit id
   * @apiSuccess {String} habits.habit_name Name of habit
   * @apiSuccess {String} habits.habit_description Description of habit
   * @apiSuccess {String} habits.habit_category Category of habit
   * @apiSuccess {TinyInt} habits.is_default Default habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "habit_id": 1,
   *   "habit_name": "Read",
   *   "habit_description": "Read a book",
   *   "habit_category": "Personal",
   *   "is_default": 1
   *  },
   *  {
   *   "habit_id": 2,
   *   "habit_name": "Meditate",
   *   "habit_description": "Meditate for 10 minutes",
   *   "habit_category": "Personal",
   *   "is_default": 1
   *  },
   *  {
   *   "habit_id": 3,
   *   "habit_name": "Exercise",
   *   "habit_description": "Exercise for 30 minutes",
   *   "habit_category": "Health",
   *   "is_default": 0
   *  },
   * ]
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *   "message": "Habits not found"
   * }
   *
   */
  .get('/', getAllHabits);
habitRoute
  /**
   * @api {get} /habits/created Get all created habits
   * @apiName GetAllCreatedHabits
   * @apiGroup Habit
   * @apiPermission user
   * @apiSuccess {Object[]} habits List of all created habits
   * @apiSuccess {Number} habits.habit_id Habit id
   * @apiSuccess {String} habits.habit_name Name of habit
   * @apiSuccess {String} habits.habit_description Description of habit
   * @apiSuccess {String} habits.habit_category Category of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "habit_id": 1,
   *   "habit_name": "Read",
   *   "habit_description": "Read a book",
   *   "habit_category": "Personal",
   *  },
   *  {
   *   "habit_id": 2,
   *   "habit_name": "Meditate",
   *   "habit_description": "Meditate for 10 minutes",
   *   "habit_category": "Personal",
   *  },
   * ]
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Habits not found"
   * }
   */
  .get('/created', getAllCreatedHabits);
habitRoute
  /**
   * @api {get} /habits/created/:id Get created habit by id
   * @apiName GetCreatedHabit
   * @apiGroup Habit
   * @apiPermission user
   * @apiParam {Number} id Habit id
   * @apiSuccess {Number} habit_id Habit id
   * @apiSuccess {String} habit_name Name of habit
   * @apiSuccess {String} habit_description Description of habit
   * @apiSuccess {String} habit_category Category of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "habit_id": 1,
   *  "habit_name": "Read",
   *  "habit_description": "Read a book",
   *  "habit_category": "Personal",
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Habit not found"
   * }
   */
  .get('/created/:id', getCreatedHabit);
habitRoute
  /**
   * @api {put} /habits/habit Update habit
   * @apiName PutHabit
   * @apiGroup Habit
   * @apiPermission user
   * @apiParam {Number} habit_id Habit id
   * @apiParamExample {json} Input
   * {
   *  "habit_id": 1,
   * }
   * @apiSuccess {String} message Habit updated
   * @apiSuccess {Object} habit Updated habit
   * @apiSuccess {Number} habit_id Habit id
   * @apiSuccess {String} habit_name Name of habit
   * @apiSuccess {String} habit_description Description of habit
   * @apiSuccess {String} habit_category Category of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Habit updated",
   *  "habit": {
   *      "habit_id": 1,
   *      "habit_name": "Read",
   *      "habit_description": "Read a book",
   *      "habit_category": "Personal",
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Habit not updated"
   * }
   *
   */
  .put('/habit', authenticate, putHabit);

habitRoute
  /**
   * @api {post} /habits Create habit
   * @apiName PostHabit
   * @apiGroup Habit
   * @apiPermission user
   * @apiParam {String} habit_name Name of habit
   * @apiParam {String} habit_description Description of habit
   * @apiParam {String} habit_category Category of habit
   * @apiParamExample {json} Input
   * {
   *  "habit_name": "Read",
   *  "habit_description": "Read a book",
   *  "habit_category": "Personal",
   * }
   * @apiSuccess {String} message Habit created
   * @apiSuccess {Object} habit Created habit
   * @apiSuccess {Number} habit_id Habit id
   * @apiSuccess {String} habit_name Name of habit
   * @apiSuccess {String} habit_description Description of habit
   * @apiSuccess {String} habit_category Category of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Habit created",
   *  "habit": {
   *     "habit_id": 1,
   *     "habit_name": "Read",
   *     "habit_description": "Read a book",
   *     "habit_category": "Personal",
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Habit not created"
   * }
   *
   */
  .post('/', authenticate, postHabit);
habitRoute
  /**
   * @api {post} /habits/frequency Create habit frequency
   * @apiName PostFrequency
   * @apiGroup Habit
   * @apiPermission user
   * @apiParam {Number} habit_frequency Frequency of habit
   * @apiParamExample {json} Input
   * {
   *  "habit_frequency": 1,
   * }
   * @apiSuccess {String} message Frequency updated
   * @apiSuccess {String} habit_frequency Updated frequency
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Frequency updated",
   *  "habit_frequency": 1,
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Frequency not updated"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 400 Bad Request
   * {
   *  "message": "Missing required fields"
   * }
   *
   */
  .post('/frequency', authenticate, postFrequency);
habitRoute
  /**
   * @api {get} /habits/:id Get habit by id
   * @apiName GetHabit
   * @apiGroup Habit
   * @apiPermission all
   * @apiParam {Number} id Habit id
   * @apiSuccess {Object} habit Habit
   * @apiSuccess {Number} habit_id Habit id
   * @apiSuccess {String} habit_name Name of habit
   * @apiSuccess {String} habit_description Description of habit
   * @apiSuccess {String} habit_category Category of habit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "habit_id": 1,
   *  "habit_name": "Read",
   *  "habit_description": "Read a book",
   *  "habit_category": "Personal",
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Habit not found"
   * }
   */
  .get('/:id', getHabit);

export default habitRoute;
