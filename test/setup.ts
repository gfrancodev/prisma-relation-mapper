import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll, afterEach } from 'vitest';

export const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`;
    
    await prisma.$transaction([
      prisma.$executeRaw`DELETE FROM like;`,
      prisma.$executeRaw`DELETE FROM comment;`,
      prisma.$executeRaw`DELETE FROM post;`,
      prisma.$executeRaw`DELETE FROM follows;`,
      prisma.$executeRaw`DELETE FROM user;`
    ]);

    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`;
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
}

beforeAll(async () => {
  await cleanDatabase();
});

afterEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
}); 