import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const postComment = async (req, res) => {
  const userId = req.session.userId;
  const { postId, content } = req.body;

  if (!content) return res.send("Il commento non può essere vuoto");

  await prisma.comment.create({
    data: {
      content,
      postId: parseInt(postId),
      authorId: userId,
    },
  });

  res.redirect("/"); // torna alla Home dopo il commento
};
