import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { generateTokens } from '../lib/jwt';
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerUser = async (data: z.infer<typeof registerSchema>) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  });

  if (existingUser) {
    throw new Error('User with this email or username already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  let guestRole = await prisma.role.findUnique({ where: { name: 'GUEST' } });
  if (!guestRole) {
    guestRole = await prisma.role.create({ data: { name: 'GUEST' } });
  }

  let userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
  if (!userRole) {
    userRole = await prisma.role.create({ data: { name: 'USER' } });
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash,
      roles: {
        create: [
          { roleId: guestRole.id },
          { roleId: userRole.id },
        ],
      },
    },
  });

  const tokens = generateTokens(user.id);

  // Store refresh token in db
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { user: { id: user.id, email: user.email, username: user.username }, tokens };
};

export const loginUser = async (data: z.infer<typeof loginSchema>) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    console.error('User not found in DB:', data.email);
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    console.error('Password mismatch for:', data.email);
    throw new Error('Invalid email or password');
  }

  const tokens = generateTokens(user.id);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { user: { id: user.id, email: user.email, username: user.username }, tokens };
};
