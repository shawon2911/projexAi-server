import { Router } from 'express';
import { createProject, getProjects } from '../controllers//projectController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// GET /api/projects - Public (Explore Page)
router.get('/', getProjects);

// POST /api/projects - Protected (Deploy Matrix Brief / Add Item)
router.post('/', protect, createProject);

export default router;