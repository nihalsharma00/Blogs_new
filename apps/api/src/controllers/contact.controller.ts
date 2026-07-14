import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { contactSchema } from '../validators/contact.validator';

const prisma = new PrismaClient();

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = contactSchema.parse({
      body: req.body,
    });

    const submission = await prisma.contactSubmission.create({
      data: validatedData.body,
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Contact form submitted successfully'
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
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to submit contact form'
      }
    });
  }
};
