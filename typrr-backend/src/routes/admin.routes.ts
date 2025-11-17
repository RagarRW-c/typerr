import { Router } from 'express';
import { getAllUsers, getUserStats } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Wszystkie endpointy wymagają autoryzacji
router.get('/users', authMiddleware, getAllUsers);
router.get('/stats', authMiddleware, getUserStats);

export default router;
