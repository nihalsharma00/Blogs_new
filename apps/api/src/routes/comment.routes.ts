import { Router } from 'express';
import { getComments, createComment, updateComment, deleteComment, moderateComment } from '../controllers/comment.controller';
import { requireAuth as protect, requireRole } from '../middleware/auth';

const router = Router();

// Notice: we mount this directly on /api/v1 so paths are absolute relative to /api/v1
router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', protect, createComment);

// For comment specific actions
router.put('/comments/:id', protect, updateComment);
router.delete('/comments/:id', protect, deleteComment);
router.patch('/comments/:id/moderate', protect, requireRole('ADMIN'), moderateComment);

export default router;
