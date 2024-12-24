import { prisma } from '@/examples/database/sql-connection';
import { describe, it, expect, beforeEach } from 'vitest';
import { mapRelations } from '@prisma/utils';
import { comment, user, like } from '@prisma/client';

describe('Inner Join Tests', () => {
  let testUsername: string;
  let testUser: any;
  let testPost: any;

  beforeEach(async () => {
    await prisma.$transaction(async (tx) => {
      const timestamp = Date.now();
      testUsername = `testuser1_${timestamp}`;

      testUser = await tx.user.create({
        data: {
          username: testUsername,
          email: `test1_${timestamp}@example.com`,
          password: 'password123',
          full_name: 'Test User 1'
        }
      });

      testPost = await tx.post.create({
        data: {
          content: 'Test post 1',
          author_id: testUser.id
        }
      });

      await tx.comment.create({
        data: {
          content: 'Test comment 1',
          author_id: testUser.id,
          post_id: testPost.id
        }
      });

      await tx.like.create({
        data: {
          user_id: testUser.id,
          post_id: testPost.id
        }
      });
    });
  });

  it('should return users with their posts using INNER JOIN', async () => {
    const result = await prisma.user.findFirst({
      where: {
        username: testUsername
      },
      include: {
        posts: {
          where: {
            author_id: testUser.id
          }
        }
      }
    });

    expect(result).toBeDefined();
    expect(result?.posts).toBeDefined();
    expect(result?.posts).toHaveLength(1);
    expect(result?.username).toBe(testUsername);
  });

  it('should return posts with their comments using INNER JOIN', async () => {
    const result = await prisma.post.findFirst({
      where: {
        author: {
          username: testUsername
        },
        comments: {
          some: {}
        }
      },
      include: mapRelations(['comments.author'])
    });

    type CommentWithAuthor = comment & {
      author: user;
    };

    expect(result).toBeDefined();
    expect(result?.comments).toHaveLength(1);
    const comment = result?.comments[0] as CommentWithAuthor;
    expect(comment.content).toBe('Test comment 1');
    expect(comment.author.username).toBe(testUsername);
  });

  it('should return posts with their likes using INNER JOIN', async () => {
    const result = await prisma.post.findFirst({
      where: {
        author: {
          username: testUsername
        },
        likes: {
          some: {}
        }
      },
      include: mapRelations(['likes.user'])
    });

    type LikeWithUser = like & {
      user: user;
    };

    expect(result).toBeDefined();
    expect(result?.likes).toHaveLength(1);
    const likeWithUser = result?.likes[0] as LikeWithUser;
    expect(likeWithUser.user.username).toBe(testUsername);
  });
});
