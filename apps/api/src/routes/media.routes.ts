import { Router } from 'express';
import multer from 'multer';
import { uploadMedia, deleteMedia } from '../controllers/media.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', requireAuth, requireRole('ADMIN'), upload.single('file'), uploadMedia);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteMedia);

export default router;
