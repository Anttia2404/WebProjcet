import express from 'express';
import { getAllPosts, createPost } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllPosts);
router.post('/', authMiddleware, createPost);

export default router;
