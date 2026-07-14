import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createServer } from '../server';
import prisma from '../lib/prisma';
import { generateTokens } from '../lib/jwt';

const app = createServer();
let adminToken: string;
let adminId: string;
let categoryId: string;

beforeAll(async () => {
  // Setup admin user
  const admin = await prisma.user.create({
    data: {
      username: 'testadmin',
      email: 'admin@test.com',
      passwordHash: 'hashed',
      roles: {
        create: {
          role: {
            connectOrCreate: {
              where: { name: 'ADMIN' },
              create: { name: 'ADMIN' }
            }
          }
        }
      }
    }
  });
  adminId = admin.id;

  const tokens = generateTokens(admin.id);
  adminToken = tokens.accessToken;

  // Setup category
  const category = await prisma.category.create({
    data: { name: 'Tech', slug: 'tech' }
  });
  categoryId = category.id;
});

afterAll(async () => {
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();
});

describe('Post CRUD Integration Tests', () => {
  let createdPostId: string;

  it('should create a post (DRAFT by default)', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'My First Post',
        slug: 'my-first-post',
        content: 'This is the content of my first post with at least 10 chars.',
        categoryId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('My First Post');
    expect(res.body.data.status).toBe('DRAFT');
    createdPostId = res.body.data.id;
  });

  it('should edit a post (e.g. change title)', async () => {
    const res = await request(app)
      .put(`/api/v1/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated Post Title',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated Post Title');
  });

  it('should publish a post (change status)', async () => {
    const res = await request(app)
      .put(`/api/v1/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'PUBLISHED',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('PUBLISHED');
  });

  it('should search published posts', async () => {
    const res = await request(app)
      .get('/api/v1/posts?search=Updated&status=PUBLISHED');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].title).toBe('Updated Post Title');
  });

  it('should delete a post', async () => {
    const res = await request(app)
      .delete(`/api/v1/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is deleted
    const getRes = await request(app)
      .get(`/api/v1/posts/${createdPostId}`);
    expect(getRes.status).toBe(404);
  });
});
