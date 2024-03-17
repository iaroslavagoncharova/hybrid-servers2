import express, {Request, Response} from 'express';
import postsRouter from './routes/postsRoute';
import commentRouter from './routes/commentRoute';
import likesRouter from './routes/likesRoute';
import reflectionRouter from './routes/reflectionsRoute';
import messageRouter from './routes/messagesRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({message: 'Connected!'});
});

router.use('/posts', postsRouter);
router.use('/comments', commentRouter);
router.use('/likes', likesRouter);
router.use('/reflections', reflectionRouter);
router.use('/messages', messageRouter);

export default router;
