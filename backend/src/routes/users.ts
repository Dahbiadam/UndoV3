import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/v1/users/profile
 * Get user profile (placeholder)
 */
router.get('/profile', asyncHandler(async (req: any, res) => {
  res.json({
    success: true,
    data: {
      userId: req.user?.userId,
      email: 'placeholder@email.com',
      username: 'placeholder-user',
      profile: {
        displayName: 'Placeholder User',
        avatar: null,
        bio: 'This is a placeholder profile',
      },
    },
  });
}));

export default router;