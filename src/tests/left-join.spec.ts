import { prisma } from '@/examples/database/sql-connection';
import { describe, it, expect, beforeEach } from 'vitest';
import { mapRelations } from '@prisma/utils';
import { comment, user, like } from '@prisma/client';

describe('Left Join Tests', () => {
  let user1: any;
  let user2: any;
  let username1: string;
  let username2: string;
  let post1: any;

  beforeEach(async () => {
    await prisma.$transaction(async (tx) => {
      const timestamp = Date.now();
      username1 = `testuser1_${timestamp}`;
      username2 = `testuser2_${timestamp}`;

      [user1, user2] = await Promise.all([
        tx.user.create({
          data: {
            username: username1,
            email: `test1_${timestamp}@example.com`,
            password: 'password123',
            full_name: 'Test User 1'
          }
        }),
        tx.user.create({
          data: {
            username: username2,
            email: `test2_${timestamp}@example.com`,
            password: 'password123',
            full_name: 'Test User 2'
          }
        })
      ]);

      post1 = await tx.post.create({
        data: {
          content: 'Test post 1',
          author_id: user1.id
        }
      });

      await tx.comment.create({
        data: {
          content: 'Test comment 1',
          author_id: user1.id,
          post_id: post1.id
        }
      });

      await tx.like.create({
        data: {
          user_id: user1.id,
          post_id: post1.id
        }
      });
    });
  });

  it('should return all users and their posts using LEFT JOIN', async () => {
    const result = await prisma.user.findMany({
      where: {
        username: { in: [username1, username2] }
      },
      orderBy: { username: 'asc' },
      include: mapRelations(['posts'])
    });

    expect(result).toHaveLength(2);
    const [firstUser, secondUser] = result;
    expect(firstUser.username).toBe(username1);
    expect(secondUser.username).toBe(username2);
    expect(firstUser.posts).toHaveLength(1);
    expect(secondUser.posts).toHaveLength(0);
  });

  it('should return all posts and their comments using LEFT JOIN', async () => {
    const result = await prisma.post.findMany({
      where: {
        id: post1.id
      },
      include: mapRelations(['comments.author'])
    });

    type CommentWithAuthor = comment & {
      author: user;
    };

    expect(result).toHaveLength(1);
    const post = result[0];
    expect(post.comments).toHaveLength(1);
    
    const comment = post.comments[0] as CommentWithAuthor;
    expect(comment.content).toBe('Test comment 1');
    expect(comment.author.username).toBe(username1);
  });

  it('should return all posts and their likes using LEFT JOIN', async () => {
    const result = await prisma.post.findMany({
      where: {
        id: post1.id
      },
      include: mapRelations(['likes.user'])
    });

    type LikeWithUser = like & {
      user: user;
    };

    expect(result).toHaveLength(1);
    const post = result[0];
    expect(post.likes).toHaveLength(1);
    
    const likeWithUser = post.likes[0] as LikeWithUser;
    expect(likeWithUser.user.username).toBe(username1);
  });
});
