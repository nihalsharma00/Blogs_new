import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getTags = async (req: Request, res: Response) => {
  try {
    const items = await prisma.tag.findMany();
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch tags' } });
  }
};

export const getTag = async (req: Request, res: Response) => {
  try {
    const item = await prisma.tag.findUnique({ where: { slug: req.params.slug } });
    if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tag not found' } });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch tag' } });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const item = await prisma.tag.create({ data: req.body });
    return res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Tag already exists' } });
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create tag' } });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const item = await prisma.tag.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update tag' } });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    await prisma.tag.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete tag' } });
  }
};
