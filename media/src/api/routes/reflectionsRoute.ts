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
  .get(fetchAllReflections)
  .post(authenticate, postReflection);

reflectionRouter.route('/prompts').get(getPrompts);

reflectionRouter.route('/byuser/:id').get(authenticate, fetchReflectionByUser);

export default reflectionRouter;
