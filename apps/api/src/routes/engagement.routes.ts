import { Router } from 'express';
import { toggleLike, toggleBookmark } from '../controllers/engagement.controller';
import { requireAuth as protect } from '../middleware/auth';

const router = Router();

// Notice that the paths here shouldn't have /posts since we will mount this on /api/v1/engagement or we can mount it directly on /api/v1/posts in server.ts.
// Let's mount it on /api/v1 as router.use('/api/v1', engagementRoutes); wait, I'll mount it on /api/v1 directly and define the full paths.

router.post('/posts/:id/like', protect, toggleLike);
router.post('/posts/:id/bookmark', protect, toggleBookmark);

export default router;
