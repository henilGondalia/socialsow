import express from 'express';
import { fetchChat, accessChat, createGroupChat, renameGroupChat, addToGroup, removeFromGroup } from '../controllers/chat.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

router.get('/', verifyToken, fetchChat);
router.post('/', verifyToken, accessChat);
router.post('/group', verifyToken, createGroupChat);
router.put('/group/rename', verifyToken, renameGroupChat);
router.put('/group/add', verifyToken, addToGroup);
router.put('/group/remove', verifyToken, removeFromGroup);

export default router;