import { Router } from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { CategorySchema } from '../validators/content.validator';

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategory);
router.post('/', requireAuth, requireRole('ADMIN'), validateRequest(CategorySchema), createCategory);
router.put('/:id', requireAuth, requireRole('ADMIN'), validateRequest(CategorySchema.partial()), updateCategory);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteCategory);

export default router;
