"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', projectController_1.getProjects);
router.get('/my-projects', projectController_1.getMyProjects);
router.get('/:id', projectController_1.getProjectById); // 👈 View Details এর জন্য এই রাউট আবশ্যক
router.post('/', authMiddleware_1.protect, projectController_1.createProject);
exports.default = router;
