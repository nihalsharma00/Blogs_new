import { Router } from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/post.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { CreatePostSchema, UpdatePostSchema } from '../validators/content.validator';

const router = Router();

router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', requireAuth, requireRole('ADMIN'), validateRequest(CreatePostSchema), createPost);
router.put('/:id', requireAuth, requireRole('ADMIN'), validateRequest(UpdatePostSchema), updatePost);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deletePost);

export default router;
