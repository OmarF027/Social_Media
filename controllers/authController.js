import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const getRegister = (req, res) => {
  res.render("register");
};

export const postRegister = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    req.session.userId = user.id;
    res.redirect("/");
  } catch (err) {
    res.send("Errore: " + err.message);
  }
};

export const getLogin = (req, res) => {
  res.render("login");
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.send("Email non trovata");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.send("Password errata");

  req.session.userId = user.id;
  res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
