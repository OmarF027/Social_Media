import express from "express";
import { postComment } from "../controllers/commentController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/comments", isAuthenticated, postComment);

export default router;
