import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import pino from 'pino';

const prisma = new PrismaClient();
const logger = pino();

export const logAdminAction = async (
  req: Request,
  action: string,
  resource: string,
  resourceId?: string,
  details?: string
) => {
  try {
    const userId = (req as any).user?.id || null;
    const ipAddress = req.ip || req.socket.remoteAddress || null;

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    logger.error('Failed to write audit log:', error);
  }
};
