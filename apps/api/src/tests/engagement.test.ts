import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createServer } from '../server';
import prisma from '../lib/prisma';
import { generateTokens } from '../lib/jwt';

const app = createServer();

let adminToken: string;
let user1Token: string;
let user2Token: string;

let adminId: string;
let user1Id: string;
let user2Id: string;

let postId: string;
let commentId: string;

beforeAll(async () => {
  // Create Admin
  const admin = await prisma.user.create({
    data: {
      username: 'engagement_admin',
      email: 'engagement_admin@test.com',
      passwordHash: 'hashed',
      roles: {
        create: {
          role: { connectOrCreate: { where: { name: 'ADMIN' }, create: { name: 'ADMIN' } } }
        }
      }
    }
  });
  adminId = admin.id;
  adminToken = generateTokens(admin.id).accessToken;

  // Create User 1
  const user1 = await prisma.user.create({
    data: { username: 'engagement_user1', email: 'user1@test.com', passwordHash: 'hashed' }
  });
  user1Id = user1.id;
  user1Token = generateTokens(user1.id).accessToken;

  // Create User 2
  const user2 = await prisma.user.create({
    data: { username: 'engagement_user2', email: 'user2@test.com', passwordHash: 'hashed' }
  });
  user2Id = user2.id;
  user2Token = generateTokens(user2.id).accessToken;

  // Create a Post
  const post = await prisma.post.create({
    data: {
      title: 'Test Post for Engagement',
      slug: 'test-post-engagement',
      content: 'Hello world',
      status: 'PUBLISHED',
      authorId: admin.id
    }
  });
  postId = post.id;
});

afterAll(async () => {
  await prisma.comment.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.post.deleteMany({ where: { id: postId } });
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany({ where: { id: { in: [adminId, user1Id, user2Id] } } });
});

describe('Engagement & Comments Integration Tests', () => {
  describe('Likes & Bookmarks', () => {
    it('User1 can like the post', async () => {
      const res = await request(app)
        .post(`/api/v1/posts/${postId}/like`)
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Post liked');

      const post = await prisma.post.findUnique({ where: { id: postId } });
      expect(post?.likeCount).toBe(1);
    });

    it('User1 can unlike the post', async () => {
      const res = await request(app)
        .post(`/api/v1/posts/${postId}/like`)
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Post unliked');

      const post = await prisma.post.findUnique({ where: { id: postId } });
      expect(post?.likeCount).toBe(0);
    });

    it('User2 can bookmark the post', async () => {
      const res = await request(app)
        .post(`/api/v1/posts/${postId}/bookmark`)
        .set('Authorization', `Bearer ${user2Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Post bookmarked');

      const bookmark = await prisma.bookmark.findUnique({
        where: { userId_postId: { userId: user2Id, postId } }
      });
      expect(bookmark).not.toBeNull();
    });
  });

  describe('Comments', () => {
    it('User1 can add a comment', async () => {
      const res = await request(app)
        .post(`/api/v1/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ content: 'First comment!' });

      expect(res.status).toBe(201);
      expect(res.body.data.content).toBe('First comment!');
      commentId = res.body.data.id;

      const post = await prisma.post.findUnique({ where: { id: postId } });
      expect(post?.commentCount).toBe(1);
    });

    it('User2 can reply to the comment', async () => {
      const res = await request(app)
        .post(`/api/v1/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ content: 'Reply to first comment', parentId: commentId });

      expect(res.status).toBe(201);
      expect(res.body.data.parentId).toBe(commentId);
      
      const post = await prisma.post.findUnique({ where: { id: postId } });
      expect(post?.commentCount).toBe(2);
    });

    it('User2 cannot edit User1s comment (Ownership check)', async () => {
      const res = await request(app)
        .put(`/api/v1/comments/${commentId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ content: 'Hacked comment' });

      expect(res.status).toBe(403); // Forbidden
    });

    it('User1 can edit their own comment', async () => {
      const res = await request(app)
        .put(`/api/v1/comments/${commentId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ content: 'First comment edited!' });

      expect(res.status).toBe(200);
      expect(res.body.data.content).toBe('First comment edited!');
    });

    it('Admin can moderate (hide) the comment', async () => {
      const res = await request(app)
        .patch(`/api/v1/comments/${commentId}/moderate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isHidden: true });

      expect(res.status).toBe(200);
      expect(res.body.data.isHidden).toBe(true);
    });

    it('User1 cannot moderate comments (Admin check)', async () => {
      const res = await request(app)
        .patch(`/api/v1/comments/${commentId}/moderate`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ isHidden: false });

      expect(res.status).toBe(403);
    });

    it('User1 can delete their own comment', async () => {
      const res = await request(app)
        .delete(`/api/v1/comments/${commentId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);

      // Comment count should decrease. We delete 1 comment + 1 reply = 2.
      // Wait, deleteComment in our implementation just decrements by totalToDelete, let's check
      const post = await prisma.post.findUnique({ where: { id: postId } });
      expect(post?.commentCount).toBe(0);
    });
  });
});
