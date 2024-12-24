import { prisma } from './database/sql-connection';
import { mapRelations } from '@prisma/utils';

/**
 * Fetches users and their posts using INNER JOIN through Prisma ORM
 * 
 * @remarks
 * Uses the `some` clause in the where condition to ensure only users with posts are returned,
 * effectively creating an INNER JOIN
 * 
 * @returns {Promise<Array<User & {posts: Post[]}>>} Array of users with their respective posts
 * @throws {PrismaClientKnownRequestError} If there's an error in the database query
 */
async function getUsersWithPosts() {
  return prisma.user.findMany({
    where: {
      posts: {
        some: {} // Ensures INNER JOIN - returns only users with posts
      }
    },
    include: mapRelations(['posts'])
  });
}

/**
 * Fetches posts and their comments using INNER JOIN through Prisma ORM
 * 
 * @remarks
 * Uses the `some` clause in the where condition to ensure only posts with comments are returned,
 * effectively creating an INNER JOIN
 * 
 * @returns {Promise<Array<Post & {comments: (Comment & {author: User})[]}>>} Array of posts with their comments and authors
 * @throws {PrismaClientKnownRequestError} If there's an error in the database query
 */
async function getPostsWithComments() {
  return prisma.post.findMany({
    where: {
      comments: {
        some: {} // Ensures INNER JOIN - returns only posts with comments
      }
    },
    include: mapRelations(['comments', 'comments.author'])
  });
}

/**
 * Fetches posts and their likes using INNER JOIN through Prisma ORM
 * 
 * @remarks
 * Uses the `some` clause in the where condition to ensure only posts with likes are returned,
 * effectively creating an INNER JOIN
 * 
 * @returns {Promise<Array<Post & {likes: (Like & {user: User})[]}>>} Array of posts with their likes and users
 * @throws {PrismaClientKnownRequestError} If there's an error in the database query
 */
async function getPostsWithLikes() {
  return prisma.post.findMany({
    where: {
      likes: {
        some: {} // Ensures INNER JOIN - returns only posts with likes
      }
    },
    include: mapRelations(['likes.user'])
  });
}

/**
 * Demonstrates different types of INNER JOIN using Prisma ORM
 * 
 * @remarks
 * This function exemplifies three different types of INNER JOIN using Prisma:
 * - Between users and posts
 * - Between posts and comments
 * - Between posts and likes
 * 
 * Results are displayed in the console in formatted JSON
 * 
 * @example
 * ```typescript
 * try {
 *   await innerJoinExample();
 * } catch (error) {
 *   console.error('Error executing example:', error);
 * }
 * ```
 * 
 * @throws {PrismaClientKnownRequestError} If there's an error in any of the queries
 * @returns {Promise<void>} Promise that resolves when all queries are completed
 */
async function innerJoinExample() {
  const usersWithPosts = await getUsersWithPosts();
  const postsWithComments = await getPostsWithComments();
  const postsWithLikes = await getPostsWithLikes();

  console.log('\n\x1b[36m=== Users and their posts ===\x1b[0m');
  console.log('\x1b[33m' + JSON.stringify(usersWithPosts, null, 2) + '\x1b[0m');

  console.log('\n\x1b[36m=== Posts and their comments ===\x1b[0m');
  console.log('\x1b[33m' + JSON.stringify(postsWithComments, null, 2) + '\x1b[0m');

  console.log('\n\x1b[36m=== Posts and their likes ===\x1b[0m');
  console.log('\x1b[33m' + JSON.stringify(postsWithLikes, null, 2) + '\x1b[0m');
}

innerJoinExample()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
