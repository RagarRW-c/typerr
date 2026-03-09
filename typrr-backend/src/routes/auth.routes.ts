import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  refresh,
  logout
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// 👇 NOWE
router.post('/refresh', refresh);
router.post('/logout', logout);

router.get('/profile', authMiddleware, getProfile);

export default router;