import { z } from 'zod';

export const newsletterSubscribeSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').max(255),
  })
});

export const newsletterUnsubscribeSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').max(255),
  })
});
