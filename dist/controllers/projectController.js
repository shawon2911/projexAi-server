"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = exports.createProject = void 0;
const Project_1 = __importDefault(require("../models/Project"));
// Create a new Project (Protected)
const createProject = async (req, res) => {
    try {
        const { title, description, shortDescription, category, budget, skills } = req.body;
        if (!title || !description || !category || !budget) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }
        const project = new Project_1.default({
            title,
            description,
            shortDescription: shortDescription || description.substring(0, 150) + '...',
            category,
            budget,
            skills: Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim()),
            createdBy: req.user?.id
        });
        await project.save();
        res.status(201).json({ message: 'Project created successfully', project });
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error while creating project' });
    }
};
exports.createProject = createProject;
// Get All Projects with Search & Filtering (Public)
const getProjects = async (req, res) => {
    try {
        const { search, category } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category && category !== 'All') {
            query.category = category;
        }
        const projects = await Project_1.default.find(query)
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 });
        res.status(200).json({ count: projects.length, projects });
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error while fetching projects' });
    }
};
exports.getProjects = getProjects;
