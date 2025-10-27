import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createConversation,
  listConversations,
  createMessage,
  listMessages,
} from "../controllers/conversationController.js";

const router = express.Router();

router.post("/", authMiddleware, createConversation);
router.get("/", authMiddleware, listConversations);

router.get("/:conversationId/messages", authMiddleware, listMessages);
router.post("/:conversationId/messages", authMiddleware, createMessage);

export default router;
