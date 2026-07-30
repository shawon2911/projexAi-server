import { Router } from 'express';
import { createProject, getProjects, getProjectById, getMyProjects } from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProjects);
router.get('/my-projects', getMyProjects);
router.get('/:id', getProjectById); // 👈 View Details এর জন্য এই রাউট আবশ্যক
router.post('/', protect, createProject);

export default router;