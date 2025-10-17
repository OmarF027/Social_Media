import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
faker.locale = "it"; // Italiano

async function main() {
  console.log("🇮🇹 Inizio inserimento dati fake in italiano...");

  // Cancella dati esistenti
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany({
    where: { email: { not: "admin@example.com" } }, // salva admin
  });

  // Crea admin fisso
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "Admin",
      email: "admin@example.com",
      password: "admin123", // in produzione hashare
      profilePictureURL: null,
    },
  });

  // Crea utenti casuali
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.person.firstName() + faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profilePictureURL: null,
      },
    });
    users.push(user);
  }

  const allUsers = [admin, ...users];

  // Crea post casuali
  const posts = [];
  for (let i = 0; i < 10; i++) {
    const author = faker.helpers.arrayElement(allUsers);
    const post = await prisma.post.create({
      data: {
        content: faker.lorem.sentences(2),
        authorId: author.id,
      },
    });
    posts.push(post);
  }

  // Crea commenti casuali
  for (const post of posts) {
    const commentCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < commentCount; i++) {
      const author = faker.helpers.arrayElement(allUsers);
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          authorId: author.id,
          postId: post.id,
        },
      });
    }
  }

  console.log("✅ Inserimento dati completato!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
