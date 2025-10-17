import express from "express";
import { getFeed, getCreatePost, postCreatePost } from "../controllers/postController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/feed", isAuthenticated, getFeed);
router.get("/posts/create", isAuthenticated, getCreatePost);
router.post("/posts/create", isAuthenticated, postCreatePost);

export default router;
