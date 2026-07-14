import { Router } from 'express';
import { getGenres, getGenre, createGenre, updateGenre, deleteGenre } from '../controllers/genre.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { GenreSchema } from '../validators/content.validator';

const router = Router();

router.get('/', getGenres);
router.get('/:slug', getGenre);
router.post('/', requireAuth, requireRole('ADMIN'), validateRequest(GenreSchema), createGenre);
router.put('/:id', requireAuth, requireRole('ADMIN'), validateRequest(GenreSchema.partial()), updateGenre);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteGenre);

export default router;
