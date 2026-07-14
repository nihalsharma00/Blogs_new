import { Router } from 'express';
import { getTags, getTag, createTag, updateTag, deleteTag } from '../controllers/tag.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { TagSchema } from '../validators/content.validator';

const router = Router();

router.get('/', getTags);
router.get('/:slug', getTag);
router.post('/', requireAuth, requireRole('ADMIN'), validateRequest(TagSchema), createTag);
router.put('/:id', requireAuth, requireRole('ADMIN'), validateRequest(TagSchema.partial()), updateTag);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteTag);

export default router;
