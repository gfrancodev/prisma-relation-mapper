import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany(); 
  await prisma.follows.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      username: 'johnsmith',
      email: 'john@email.com',
      password: '123456',
      full_name: 'John Smith',
      bio: 'Developer and tech enthusiast'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'marylewis',
      email: 'mary@email.com', 
      password: '123456',
      full_name: 'Mary Lewis',
      bio: 'Photographer and nature lover'
    }
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'peterharris',
      email: 'peter@email.com',
      password: '123456',
      full_name: 'Peter Harris',
      bio: 'Part-time musician'
    }
  });

  const post1 = await prisma.post.create({
    data: {
      content: 'First post! So happy to share my journey here.',
      image_url: 'https://example.com/image1.jpg',
      author_id: user1.id
    }
  });

  const post2 = await prisma.post.create({
    data: {
      content: 'What a beautiful day for photography! 📸',
      image_url: 'https://example.com/image2.jpg',
      author_id: user2.id
    }
  });

  const post3 = await prisma.post.create({
    data: {
      content: 'New music project in progress! 🎸',
      image_url: 'https://example.com/image3.jpg',
      author_id: user3.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Very cool! Welcome!',
      author_id: user2.id,
      post_id: post1.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Amazing photo! Which camera do you use?',
      author_id: user3.id,
      post_id: post2.id
    }
  });

  await prisma.comment.create({
    data: {
      content: "Can't wait to hear it!",
      author_id: user1.id,
      post_id: post3.id
    }
  });

  await prisma.like.create({
    data: {
      user_id: user2.id,
      post_id: post1.id
    }
  });

  await prisma.like.create({
    data: {
      user_id: user3.id,
      post_id: post1.id
    }
  });

  await prisma.like.create({
    data: {
      user_id: user1.id,
      post_id: post2.id
    }
  });

  await prisma.follows.create({
    data: {
      follower_id: user2.id,
      following_id: user1.id
    }
  });

  await prisma.follows.create({
    data: {
      follower_id: user3.id,
      following_id: user1.id
    }
  });

  await prisma.follows.create({
    data: {
      follower_id: user1.id,
      following_id: user2.id
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
