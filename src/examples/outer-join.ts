import { prisma } from './database/sql-connection';
import { mapRelations } from '@prisma/utils';

/**
 * Fetches all users with their posts using LEFT OUTER JOIN
 * @returns {Promise<Array<user & {
 *   posts: Array<post & {
 *     comments: comment[],
 *     likes: like[]
 *   }>
 * }>>} Users and their posts
 */
async function getUsersWithPosts() {
  return prisma.user.findMany({
    include: mapRelations(['posts', 'posts.comments', 'posts.likes'])
  });
}

/**
 * Fetches all posts with their authors using RIGHT OUTER JOIN
 * @returns {Promise<Array<post & {
 *   author: user & {
 *     followers: follows[]
 *   }
 * }>>} Posts and their authors
 */
async function getPostsWithAuthors() {
  return prisma.post.findMany({
    include: mapRelations(['author', 'author.followers'])
  });
}

/**
 * Fetches all follower relationships using FULL OUTER JOIN
 * @returns {Promise<Array<follows & {
 *   follower: user,
 *   following: user
 * }>>} Follower relationships
 */
async function getFollowRelationships() {
  return prisma.follows.findMany({
    include: mapRelations(['follower', 'following'])
  });
}

/**
 * Example demonstrating different types of outer joins using Prisma ORM
 * 
 * This function shows how to:
 * - Perform LEFT OUTER JOIN to get all users with their posts
 * - Perform RIGHT OUTER JOIN to get all posts with their authors
 * - Perform FULL OUTER JOIN to get all follower relationships
 * 
 * @example
 * ```ts
 * await outerJoinExample();
 * ```
 * 
 * @throws {PrismaClientKnownRequestError} If there's an error executing the queries
 * @returns {Promise<void>} Resolves when all queries are completed
 */
async function outerJoinExample() {
  const usersWithPosts = await getUsersWithPosts();
  const postsWithAuthors = await getPostsWithAuthors();
  const allFollowRelations = await getFollowRelationships();

  console.log('\n=== Users and their posts ===');
  console.log(JSON.stringify(usersWithPosts, null, 2));

  console.log('\n=== Posts and their authors ===');
  console.log(JSON.stringify(postsWithAuthors, null, 2));

  console.log('\n=== Follow relationships ===');
  console.log(JSON.stringify(allFollowRelations, null, 2));
}

outerJoinExample()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
