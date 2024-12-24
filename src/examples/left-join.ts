import { prisma } from './database/sql-connection';
import { mapRelations } from '@prisma/utils';

/**
 * Fetches all users and their posts using LEFT JOIN
 * @returns {Promise<Array<user & {posts: post[]}>>} Users and their posts
 */
async function getUsersAndPosts() {
  return prisma.user.findMany({
    include: mapRelations(['posts'])
  });
}

/**
 * Fetches all posts and their comments using LEFT JOIN
 * @returns {Promise<Array<post & {comments: (comment & {author: user})[]}>>} Posts and their comments
 */
async function getPostsAndComments() {
  return prisma.post.findMany({
    include: mapRelations(['comments', 'comments.author'])
  });
}

/**
 * Fetches all posts and their likes using LEFT JOIN
 * @returns {Promise<Array<post & {likes: (like & {user: user})[]}>>} Posts and their likes
 */
async function getPostsAndLikes() {
  return prisma.post.findMany({
    include: mapRelations(['likes.user'])
  });
}

/**
 * Example demonstrating different types of LEFT JOIN using Prisma ORM
 * 
 * This function shows how to:
 * - Perform LEFT JOIN to get all users and their posts
 * - Perform LEFT JOIN to get all posts and their comments
 * - Perform LEFT JOIN to get all posts and their likes
 * 
 * @example
 * ```ts
 * await leftJoinExample();
 * ```
 * 
 * @throws {PrismaClientKnownRequestError} If there's an error executing the queries
 * @returns {Promise<void>} Resolves when all queries are completed
 */
async function leftJoinExample() {
  const usersAndPosts = await getUsersAndPosts();
  const postsAndComments = await getPostsAndComments();
  const postsAndLikes = await getPostsAndLikes();

  console.log('\n\x1b[36m=== Users and their posts ===\x1b[0m');
  console.log('\x1b[33m' + JSON.stringify(usersAndPosts, null, 2) + '\x1b[0m');

  console.log('\n\x1b[36m=== Posts and their comments ===\x1b[0m');
  console.log('\x1b[33m' + JSON.stringify(postsAndComments, null, 2) + '\x1b[0m');

  console.log('\n\x1b[36m=== Posts and their likes ===\x1b[0m');
  console.log('\x1b[33m' + JSON.stringify(postsAndLikes, null, 2) + '\x1b[0m');
}

leftJoinExample()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
