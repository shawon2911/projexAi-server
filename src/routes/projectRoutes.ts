import { Router } from 'express';
import { createProject, getProjectById, getProjects } from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';
import {getMyProjects } from '../controllers/projectController';

const router = Router();

// GET /api/projects - Public (Explore Page)
router.get('/', getProjects);

// POST /api/projects - Protected (Deploy Matrix Brief / Add Item)
router.post('/', protect, createProject);


router.get('/my-projects', protect, getMyProjects);

// Express/Node.js backend (e.g., routes/projectRoutes.js)
router.get('/projects/:id', getProjectById);



export default router;