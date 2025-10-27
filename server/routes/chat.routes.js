import express from "express";
import { handleChat } from "../controllers/chatController.js"; // Import Controller

const router = express.Router();

router.post("/chat", handleChat);

export default router;
