import { Router } from 'express';
import { saveAttempt, getUserAttempts, getUserStats } from '../controllers/attempts.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', saveAttempt);
router.get('/', getUserAttempts);
router.get('/stats', getUserStats);

export default router;