import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import prisma from '../lib/prisma';
import { generateTokens, verifyRefreshToken } from '../lib/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const data = authService.registerSchema.parse(req.body);
    const result = await authService.registerUser(data);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: { user: result.user, accessToken: result.tokens.accessToken },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = authService.loginSchema.parse(req.body);
    const result = await authService.loginUser(data);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: { user: result.user, accessToken: result.tokens.accessToken },
    });
  } catch (error: any) {
    console.error('LOGIN ERROR:', error);
    res.status(401).json({ success: false, error: { message: error.message } });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: { message: 'No refresh token provided' } });
    }

    const payload = verifyRefreshToken(refreshToken);
    
    // Check if session exists in DB
    const session = await prisma.session.findUnique({ where: { refreshToken } });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ success: false, error: { message: 'Invalid or expired refresh token' } });
    }

    const tokens = generateTokens(payload.userId);

    // Rotate refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  } catch (error: any) {
    res.status(401).json({ success: false, error: { message: 'Invalid token' } });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await prisma.session.deleteMany({ where: { refreshToken } });
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: 'Server error' } });
  }
};
