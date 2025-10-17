import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mostra il feed dei post dell’utente e dei seguiti
export const getFeed = async (req, res) => {
  const userId = req.session.userId;

  // Prendi tutti i post dell’utente loggato
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  res.render("feed", { posts });
};

// Mostra form per creare post
export const getCreatePost = (req, res) => {
  res.render("createPost");
};

// Salva un nuovo post
export const postCreatePost = async (req, res) => {
  const userId = req.session.userId;
  const { content } = req.body;

  if (!content) return res.send("Il post non può essere vuoto");

  await prisma.post.create({
    data: {
      content,
      authorId: userId,
    },
  });

  res.redirect("/feed");
};
