import { z } from 'zod';

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address').max(255),
    subject: z.string().min(2, 'Subject must be at least 2 characters').max(255),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  })
});

export type ContactInput = z.infer<typeof contactSchema>['body'];
