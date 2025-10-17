import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const toggleLike = async (req, res) => {
  const userId = req.session.userId;
  const { postId } = req.body;

  // Controlla se l'utente ha già messo like
  const existingLike = await prisma.like.findFirst({
    where: { postId: parseInt(postId), userId },
  });

  if (existingLike) {
    // Rimuove il like
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    // Aggiunge il like
    await prisma.like.create({
      data: { postId: parseInt(postId), userId },
    });
  }

  res.redirect("/"); // torna alla Home
};
