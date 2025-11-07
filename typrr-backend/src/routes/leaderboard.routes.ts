import { Router } from 'express';
import { getGlobalLeaderboard, getLanguageLeaderboard } from '../controllers/leaderboard.controller';

const router = Router();

router.get('/', getGlobalLeaderboard);
router.get('/language/:language', getLanguageLeaderboard);

export default router;