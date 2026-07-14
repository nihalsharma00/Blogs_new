import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    // We fetch top level comments and their nested replies
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      include: {
        author: { select: { id: true, username: true } },
        replies: {
          include: {
            author: { select: { id: true, username: true } },
            // We can nest further if needed, but 1 level of replies is good for now
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch comments' } });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const authorId = (req as any).user.id;
    const { content, parentId } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Content is required' } });
    }

    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          postId,
          authorId,
          parentId: parentId || null,
        },
        include: {
          author: { select: { id: true, username: true } },
        },
      });

      // Increment comment count on the post
      await tx.post.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } },
      });

      return newComment;
    });

    return res.status(201).json({ success: true, data: comment });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create comment' } });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const authorId = (req as any).user.id;
    const { content } = req.body;

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Comment not found' } });
    }

    if (existingComment.authorId !== authorId) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only edit your own comments' } });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    return res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update comment' } });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const authorId = (req as any).user.id;

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Comment not found' } });
    }

    if (existingComment.authorId !== authorId) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only delete your own comments' } });
    }

    await prisma.$transaction(async (tx) => {
      // Deleting a top-level comment deletes its replies due to onDelete: Cascade. 
      // We should ideally calculate how many are being deleted to decrement post count properly, 
      // but for simplicity, we decrement by 1. A better approach is to count replies before delete.
      
      const repliesCount = await tx.comment.count({ where: { parentId: commentId } });
      const totalToDelete = 1 + repliesCount;

      await tx.comment.delete({ where: { id: commentId } });

      await tx.post.update({
        where: { id: existingComment.postId },
        data: { commentCount: { decrement: totalToDelete } },
      });
    });

    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete comment' } });
  }
};

export const moderateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const { isHidden } = req.body;

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { isHidden },
    });

    return res.status(200).json({ success: true, data: comment });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to moderate comment' } });
  }
};
