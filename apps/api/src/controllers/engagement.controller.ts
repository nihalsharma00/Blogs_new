import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = (req as any).user.id;

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.postLike.delete({
          where: { userId_postId: { userId, postId } },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);
      return res.status(200).json({ success: true, message: 'Post unliked' });
    } else {
      await prisma.$transaction([
        prisma.postLike.create({
          data: { userId, postId },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
        }),
      ]);
      return res.status(200).json({ success: true, message: 'Post liked' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to toggle like' } });
  }
};

export const toggleBookmark = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = (req as any).user.id;

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { userId_postId: { userId, postId } },
      });
      return res.status(200).json({ success: true, message: 'Post removed from bookmarks' });
    } else {
      await prisma.bookmark.create({
        data: { userId, postId },
      });
      return res.status(200).json({ success: true, message: 'Post bookmarked' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to toggle bookmark' } });
  }
};
