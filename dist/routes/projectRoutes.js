"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers//projectController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/projects - Public (Explore Page)
router.get('/', projectController_1.getProjects);
// POST /api/projects - Protected (Deploy Matrix Brief / Add Item)
router.post('/', authMiddleware_1.protect, projectController_1.createProject);
exports.default = router;
