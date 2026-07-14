import { beforeAll, afterAll, afterEach } from 'vitest';
import prisma from '../lib/prisma';

beforeAll(async () => {
  // connect to db if needed
});

afterEach(async () => {
  // clean up tables after each test if needed
  // await prisma.post.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.genre.deleteMany();
  // await prisma.tag.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
