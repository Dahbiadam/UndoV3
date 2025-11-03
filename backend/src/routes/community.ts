import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/v1/community/posts
 * Get community posts (placeholder)
 */
router.get('/posts', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      posts: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    },
  });
}));

export default router;