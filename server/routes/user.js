import express from 'express';
import {
    getUser,
    getUsers,
    getUserFriends,
    addRemoveFriend,
    getBookmarkedPosts,
    bookmarkPost,
} from "../controllers/user.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', verifyToken, getUser);
router.get('/', verifyToken, getUsers);
router.get('/:id/friends', verifyToken, getUserFriends);
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);
router.get('/:userId/bookmarks', verifyToken, getBookmarkedPosts);
router.post('/:userId/bookmark', verifyToken, bookmarkPost);

export default router;