import express from 'express';
import { login, updatePassword } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/password', updatePassword);

export default router;
