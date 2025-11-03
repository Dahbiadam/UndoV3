import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/v1/checkins
 * Submit daily check-in (placeholder)
 */
router.post('/', asyncHandler(async (req: any, res) => {
  res.json({
    success: true,
    data: {
      checkInId: 'placeholder-checkin-id',
      submittedAt: new Date(),
    },
  });
}));

export default router;