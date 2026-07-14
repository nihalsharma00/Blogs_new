import { Router } from 'express';
import { generateSitemap } from '../controllers/seo.controller';

const router = Router();

router.get('/sitemap.xml', generateSitemap);

export default router;
