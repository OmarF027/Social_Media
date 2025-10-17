import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
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

// ROUTE autenticazione
app.use(authRoutes);

// Homepage protetta
app.get("/", isAuthenticated, async (req, res) => {
  res.render("index", { title: "Home" });
});

// Avvia il server
app.listen(3000, () => {
  console.log("✅ Server avviato su http://localhost:3000");
});
