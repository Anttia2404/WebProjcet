import express from 'express';
import { getAllItems, createItem } from '../controllers/itemController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/', authMiddleware, getAllItems);

router.post('/', authMiddleware, createItem);


export default router;
