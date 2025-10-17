import express from "express";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();
const prisma = new PrismaClient();

// Configurazione multer per upload immagini
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// GET /profile/:id → mostra il profilo di un utente
router.get("/profile/:id", isAuthenticated, async (req, res) => {
  const userId = parseInt(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: { include: { likes: true, comments: { include: { author: true } } } },
    },
  });

  if (!user) return res.status(404).send("Utente non trovato");

  res.render("profile", { title: `${user.username} - Profilo`, user });
});

// POST /profile/photo → aggiorna la foto profilo
router.post(
  "/profile/photo",
  isAuthenticated,
  upload.single("profilePicture"),
  async (req, res) => {
    const userId = req.session.userId;
    if (!req.file) return res.status(400).send("Nessun file caricato");

    const photoPath = `/uploads/${req.file.filename}`;

    await prisma.user.update({
      where: { id: userId },
      data: { profilePictureURL: photoPath },
    });

    res.redirect(`/profile/${userId}`);
  }
);

export default router;
