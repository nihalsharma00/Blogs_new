import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { newsletterSubscribeSchema, newsletterUnsubscribeSchema } from '../validators/newsletter.validator';

const prisma = new PrismaClient();

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = newsletterSubscribeSchema.parse({
      body: req.body,
    });

    const { email } = validatedData.body;

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true }
        });
      }
      res.status(200).json({
        success: true,
        message: 'Successfully subscribed to the newsletter'
      });
      return;
    }

    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter'
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors
        }
      });
      return;
    }
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to subscribe to newsletter'
      }
    });
  }
};

export const unsubscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = newsletterUnsubscribeSchema.parse({
      body: req.body,
    });

    const { email } = validatedData.body;

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing && existing.isActive) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: false }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from the newsletter'
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors
        }
      });
      return;
    }
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to unsubscribe from newsletter'
      }
    });
  }
};
