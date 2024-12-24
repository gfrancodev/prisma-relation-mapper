import { prisma } from '@/examples/database/sql-connection';
import { describe, it, expect, beforeEach } from 'vitest';
import { mapRelations } from '@prisma/utils';
import { user, follows, post } from '@prisma/client';

describe('Outer Join Tests', () => {
  let user1: any;
  let user2: any;

  beforeEach(async () => {
    await prisma.$transaction(async (tx) => {
      const timestamp = Date.now();
      
      [user1, user2] = await Promise.all([
        tx.user.create({
          data: {
            username: `user1_${timestamp}`,
            email: `user1_${timestamp}@test.com`,
            password: 'password123',
            full_name: 'Test User 1'
          }
        }),
        tx.user.create({
          data: {
            username: `user2_${timestamp}`,
            email: `user2_${timestamp}@test.com`,
            password: 'password123',
            full_name: 'Test User 2'
          }
        })
      ]);

      await tx.post.create({
        data: {
          content: 'User 1 post',
          author_id: user1.id,
          comments: {
            create: {
              content: 'Comment on user 1 post',
              author_id: user2.id
            }
          }
        }
      });

      await tx.follows.create({
        data: {
          follower_id: user2.id,
          following_id: user1.id
        }
      });
    });
  });

  it('should return all users with their posts using LEFT OUTER JOIN', async () => {
    const result = await prisma.user.findMany({
      where: {
        id: { in: [user1.id, user2.id] }
      },
      include: mapRelations(['posts.comments', 'posts.likes'])
    });

    expect(result).toHaveLength(2);
    expect(result[0].posts).toBeDefined();
    expect(result[1].posts).toBeDefined();
  });

  it('should return all posts with their authors using RIGHT OUTER JOIN', async () => {
    const result = await prisma.post.findMany({
      include: mapRelations(['author.followers'])
    });

    type PostWithAuthor = post & {
      author: user & {
        followers: follows[];
      }
    };

    expect(result.length).toBeGreaterThan(0);
    const post = result[0] as unknown as PostWithAuthor;
    expect(post.author).toBeDefined();
    expect(post.author.followers).toBeDefined();
  });

  it('should return all follower relationships using FULL OUTER JOIN', async () => {
    const result = await prisma.follows.findMany({
      include: mapRelations(['follower', 'following'])
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].follower).toBeDefined();
    expect(result[0].following).toBeDefined();
  });
});
