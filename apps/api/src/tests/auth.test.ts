import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createServer } from '../server';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

const app = createServer();

beforeAll(async () => {
  // Clean up any test users if needed before starting
  await prisma.user.deleteMany({
    where: { email: { in: ['testuser@example.com', 'newuser@example.com'] } }
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { in: ['testuser@example.com', 'newuser@example.com'] } }
  });
});

describe('Authentication Integration Tests', () => {
  let accessToken: string;
  let refreshToken: string;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Password123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('testuser@example.com');
  });

  it('should fail registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'anotheruser',
        email: 'testuser@example.com',
        password: 'Password123!',
      });

    expect(res.status).toBe(400); 
    expect(res.body.success).toBe(false);
  });

  it('should login a registered user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Password123!',
      });

    if (res.status !== 200) {
      console.log("LOGIN FAILED:", res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();

    accessToken = res.body.data.accessToken;

    // Check if refresh token cookie is set
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    
    // Extract refresh token from cookie if needed for next tests
    const refreshTokenCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
    expect(refreshTokenCookie).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should access a protected route with token', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('testuser@example.com');
  });

  it('should reject access without token', async () => {
    const res = await request(app)
      .get('/api/v1/users/me');

    expect(res.status).toBe(401);
  });
});
