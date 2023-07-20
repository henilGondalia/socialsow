import express from 'express';
import {
    fetchChat,
    accessChat,
    accessGroupChat,
    renameGroupChat,
    addToGroup,
    removeFromGroup,
    sendMessage,
    fetchAllMessages
} from '../controllers/chat.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

router.get('/', verifyToken, fetchChat);
router.post('/', verifyToken, accessChat);
router.post('/group', verifyToken, accessGroupChat);
router.put('/group/rename', verifyToken, renameGroupChat);
router.put('/group/add', verifyToken, addToGroup);
router.put('/group/remove', verifyToken, removeFromGroup);
router.post('/message', verifyToken, sendMessage);
router.get('/message/:chatId', verifyToken, fetchAllMessages);

export default router;