import express from 'express';
import {authenticate} from '../../middlewares';
import {
  fetchAllReflections,
  fetchReflectionByUser,
  getPrompts,
  postReflection,
} from '../controllers/reflectionsController';

const reflectionRouter = express.Router();

reflectionRouter
  .route('/')
  /**
   * @api {get} /reflections Get all reflections
   * @apiName GetReflections
   * @apiGroup Reflections
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiSuccess (200) {Object[]} reflections List of reflections
   * @apiSuccess (200) {Number} reflections.reflection_id Reflection id
   * @apiSuccess (200) {Number} reflections.user_id User id
   * @apiSuccess (200) {Number} reflections.prompt_id Prompt id
   * @apiSuccess (200) {String} reflections.reflection_text Reflection text
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "reflection_id": 1,
   *   "user_id": 1,
   *   "prompt_id": 1,
   *   "reflection_text": "This is a reflection"
   *  },
   *  {
   *   "reflection_id": 2,
   *   "user_id": 1,
   *   "prompt_id": 2,
   *   "reflection_text": "This is another reflection"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No reflections found"
   * }
   *
   */
  .get(fetchAllReflections)
  /**
   * @api {post} /reflections Create a new reflection
   * @apiName CreateReflection
   * @apiGroup Reflections
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiHeader {String} Authorization Bearer token
   * @apiParam  {String} reflection_text Reflection text
   * @apiParam  {Number} prompt_id Prompt id
   * @apiSuccess (201) {String} message Reflection added
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Reflection added"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Reflection not created"
   * }
   */
  .post(authenticate, postReflection);

reflectionRouter
  .route('/prompts')
  /**
   * @api {get} /reflections/prompts Get all prompts
   * @apiName GetPrompts
   * @apiGroup Reflections
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiSuccess (200) {Object[]} prompts List of prompts
   * @apiSuccess (200) {Number} prompts.prompt_id Prompt id
   * @apiSuccess (200) {String} prompts.prompt_text Prompt text
   * @apiSuccess (200) {String} prompts.type Type
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "prompt_id": 1,
   *   "prompt_text": "What did you learn today?",
   *   "type": "success"
   *  },
   *  {
   *   "prompt_id": 2,
   *   "prompt_text": "What are you grateful for?",
   *   "type": "success"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No prompts found"
   * }
   */
  .get(getPrompts);

reflectionRouter
  .route('/byuser/:id')
  /**
   * @api {get} /reflections/byuser/:id Get reflections by user
   * @apiName GetReflectionsByUser
   * @apiGroup Reflections
   * @apiVersion  1.0.0
   * @apiPermission user
   * @apiHeader {String} Authorization Bearer token
   * @apiSuccess (200) {Object[]} reflections List of reflections
   * @apiSuccess (200) {Number} reflections.reflection_id Reflection id
   * @apiSuccess (200) {Number} reflections.user_id User id
   * @apiSuccess (200) {Number} reflections.prompt_id Prompt id
   * @apiSuccess (200) {String} reflections.reflection_text Reflection text
   * @apiSuccess (200) {String} reflections.propmt_text Prompt text
   * @apiSuccessExample {json} Success-Response:
   * [
   *  {
   *   "reflection_id": 1,
   *   "user_id": 1,
   *   "prompt_id": 1,
   *   "reflection_text": "This is a reflection",
   *   "prompt_text": "What did you learn today?"
   *  },
   *  {
   *   "reflection_id": 2,
   *   "user_id": 1,
   *   "prompt_id": 2,
   *   "reflection_text": "This is another reflection",
   *   "prompt_text": "What are you grateful for?"
   *  }
   * ]
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No reflections found"
   * }
   */
  .get(authenticate, fetchReflectionByUser);

export default reflectionRouter;
