import express from 'express';
import { createMessage, getMessages, getConversations } from '../controllers/messages.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// CREATE
router.post('/create', verifyToken, createMessage);

// READ
router.get('/:senderId/:receiverId', verifyToken, getMessages);
router.get('/conversations/:userId', verifyToken, getConversations);

export default router;
