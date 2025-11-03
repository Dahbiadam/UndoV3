import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/v1/habits
 * Get user habits (placeholder)
 */
router.get('/', asyncHandler(async (req: any, res) => {
  res.json({
    success: true,
    data: {
      habits: [],
    },
  });
}));

export default router;