import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { logAdminAction } from '../utils/auditLogger';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { category, genre, search, tag, featured, status = 'PUBLISHED', page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Filter conditions
    const where: any = { status };
    if (category) where.category = { slug: category };
    if (genre) where.genre = { slug: genre };
    if (tag) where.tags = { some: { slug: tag } };
    if (featured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { content: { contains: search as string } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          author: { select: { id: true, username: true } },
          category: true,
          genre: true,
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        posts,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch posts' } });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, username: true } },
        category: true,
        genre: true,
        tags: true,
      }
    });
    if (!post) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } });
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch post' } });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { tags, ...postData } = req.body;
    const authorId = (req as any).user.id;

    const data: any = {
      ...postData,
      authorId,
    };

    if (tags && tags.length > 0) {
      data.tags = {
        connect: tags.map((id: string) => ({ id }))
      };
    }

    const post = await prisma.post.create({
      data,
      include: {
        category: true,
        genre: true,
        tags: true,
      }
    });

    await logAdminAction(req, 'CREATE_POST', 'Post', post.id, `Created post with slug: ${post.slug}`);

    return res.status(201).json({ success: true, data: post });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Post with this slug already exists' } });
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create post' } });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { tags, ...postData } = req.body;
    
    const updateData: any = { ...postData };
    
    if (tags) {
      updateData.tags = {
        set: tags.map((id: string) => ({ id }))
      };
    }

    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: updateData,
      include: { category: true, genre: true, tags: true }
    });

    await logAdminAction(req, 'UPDATE_POST', 'Post', post.id, `Updated post with slug: ${post.slug}`);

    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update post' } });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    await logAdminAction(req, 'DELETE_POST', 'Post', req.params.id);
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete post' } });
  }
};
