import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getGenres = async (req: Request, res: Response) => {
  try {
    const items = await prisma.genre.findMany();
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch genres' } });
  }
};

export const getGenre = async (req: Request, res: Response) => {
  try {
    const item = await prisma.genre.findUnique({ where: { slug: req.params.slug } });
    if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Genre not found' } });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch genre' } });
  }
};

export const createGenre = async (req: Request, res: Response) => {
  try {
    const item = await prisma.genre.create({ data: req.body });
    return res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Genre already exists' } });
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create genre' } });
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  try {
    const item = await prisma.genre.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update genre' } });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    await prisma.genre.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete genre' } });
  }
};
