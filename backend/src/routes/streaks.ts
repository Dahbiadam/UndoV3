import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/v1/streaks/current
 * Get current streak (placeholder)
 */
router.get('/current', asyncHandler(async (req: any, res) => {
  res.json({
    success: true,
    data: {
      currentStreak: 5,
      longestStreak: 12,
      totalDays: 25,
      lastActiveDate: new Date(),
    },
  });
}));

export default router;