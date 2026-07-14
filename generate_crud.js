const fs = require('fs');
const path = require('path');

const models = ['genre', 'tag'];

models.forEach((model) => {
  const Model = model.charAt(0).toUpperCase() + model.slice(1);
  const controllerContent = `import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const get${Model}s = async (req: Request, res: Response) => {
  try {
    const items = await prisma.${model}.findMany();
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch ${model}s' } });
  }
};

export const get${Model} = async (req: Request, res: Response) => {
  try {
    const item = await prisma.${model}.findUnique({ where: { slug: req.params.slug } });
    if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: '${Model} not found' } });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch ${model}' } });
  }
};

export const create${Model} = async (req: Request, res: Response) => {
  try {
    const item = await prisma.${model}.create({ data: req.body });
    return res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: '${Model} already exists' } });
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create ${model}' } });
  }
};

export const update${Model} = async (req: Request, res: Response) => {
  try {
    const item = await prisma.${model}.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update ${model}' } });
  }
};

export const delete${Model} = async (req: Request, res: Response) => {
  try {
    await prisma.${model}.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete ${model}' } });
  }
};
`;
  fs.writeFileSync(path.join(__dirname, 'apps/api/src/controllers', `${model}.controller.ts`), controllerContent);
});

const allModels = ['category', 'genre', 'tag'];
allModels.forEach((model) => {
  const Model = model.charAt(0).toUpperCase() + model.slice(1);
  const routeContent = `import { Router } from 'express';
import { get${Model}s, get${Model}, create${Model}, update${Model}, delete${Model} } from '../controllers/${model}.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { ${Model}Schema } from '../validators/content.validator';

const router = Router();

router.get('/', get${Model}s);
router.get('/:slug', get${Model});
router.post('/', requireAuth, requireRole('ADMIN'), validateRequest(${Model}Schema), create${Model});
router.put('/:id', requireAuth, requireRole('ADMIN'), validateRequest(${Model}Schema.partial()), update${Model});
router.delete('/:id', requireAuth, requireRole('ADMIN'), delete${Model});

export default router;
`;
  fs.writeFileSync(path.join(__dirname, 'apps/api/src/routes', `${model}.routes.ts`), routeContent);
});

console.log('CRUD generated');
