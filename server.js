import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import profileRoutes from "./routes/profile.js";
import { isAuthenticated } from "./middleware/authMiddleware.js";

dotenv.config();

// Setup base
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();
const app = express();

// Impostazioni base del server
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Sessione utente (necessaria per login/logout)
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// ROUTE autenticazione, post, commenti, likes e profilo
app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(likeRoutes);
app.use(profileRoutes);

// Homepage protetta con post, commenti e likes
app.get("/", isAuthenticated, async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: { include: { author: true } },
      likes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.render("index", { title: "Home", posts, userId: req.session.userId });
});

// Avvia il server
app.listen(3000, () => {
  console.log("✅ Server avviato su http://localhost:3000");
});
