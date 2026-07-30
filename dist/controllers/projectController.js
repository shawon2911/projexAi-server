"use strict";
// import { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import Project from '../models/Project';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProjects = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const Project_1 = __importDefault(require("../models/Project"));
// 1. Get All Projects (Public)
const getProjects = async (req, res) => {
    try {
        const projects = await Project_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json(projects);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Error fetching projects' });
    }
};
exports.getProjects = getProjects;
// 2. Get Single Project By ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        return res.status(200).json(project);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Error fetching project details' });
    }
};
exports.getProjectById = getProjectById;
// 3. Create Project (Protected)
const createProject = async (req, res) => {
    try {
        const { title, category, shortDescription, description, fullDescription, budget, deadline, skills } = req.body;
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User authentication failed' });
        }
        const newProject = new Project_1.default({
            title,
            category,
            shortDescription,
            description: description || fullDescription,
            budget,
            deadline,
            skills,
            createdBy: userId,
            client: userId,
            status: 'open',
        });
        const savedProject = await newProject.save();
        return res.status(201).json(savedProject);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to create project' });
    }
};
exports.createProject = createProject;
// 4. Get My Projects (Protected)
const getMyProjects = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User authentication failed' });
        }
        const projects = await Project_1.default.find({
            $or: [{ createdBy: userId }, { client: userId }]
        }).sort({ createdAt: -1 });
        return res.status(200).json(projects);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Error fetching user projects' });
    }
};
exports.getMyProjects = getMyProjects;
