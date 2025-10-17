import express from "express";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Toggle like per un post
router.post("/likes", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const { postId } = req.body;

  if (!userId) return res.redirect("/login");

  const existingLike = await prisma.like.findFirst({
    where: { postId: parseInt(postId), userId },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({
      data: { postId: parseInt(postId), userId },
    });
  }

  res.redirect("/");
});

export default router;
