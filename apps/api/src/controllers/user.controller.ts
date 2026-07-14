import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    const { passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: {
        ...userWithoutPassword,
        roles: user.roles.map(r => r.role.name)
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: 'Server error' } });
  }
};
