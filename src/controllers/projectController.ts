import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project';

interface AuthenticatedRequest extends Request {
  user?: any;
}

// 1. Create a New Project
export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Role Check
    if (req.user && req.user.role !== 'client') {
      res.status(403).json({ 
        success: false,
        message: 'Access denied. Only clients can post new projects.' 
      });
      return;
    }

    // User ID Extractor
    const userId = req.user?._id || req.user?.id || req.user;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'User authorization failed. Please log in again.' 
      });
      return;
    }

    const {
      title,
      category,
      shortDescription,
      description,
      fullDescription,
      budget,
      deadline,
      skills,
      tags,
      requirements,
    } = req.body;

    const finalDescription = description || fullDescription || shortDescription || '';

    if (!title || !finalDescription || !budget || !deadline) {
      res.status(400).json({ 
        success: false, 
        message: 'Please provide title, description, budget, and deadline.' 
      });
      return;
    }

    const processedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const processedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const processedRequirements = Array.isArray(requirements)
      ? requirements
      : typeof requirements === 'string'
      ? requirements.split(',').map((r) => r.trim()).filter(Boolean)
      : [];

    // Save to Database with createdBy field
    const newProject = new Project({
      createdBy: new mongoose.Types.ObjectId(userId),
      user: userId,
      client: userId,
      title,
      category: category || 'Web Development',
      shortDescription: shortDescription || '',
      description: finalDescription,
      fullDescription: finalDescription,
      budget: Number(budget),
      deadline: new Date(deadline),
      skills: processedSkills,
      tags: processedTags,
      requirements: processedRequirements,
      status: 'open',
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: savedProject,
    });
  } catch (error: any) {
    console.error('SERVER ERROR IN CREATE PROJECT:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project',
      error: error?.message || 'Unknown error',
    });
  }
};

// 2. Get All Projects (missing function fixed here)
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error: any) {
    console.error('SERVER ERROR IN GET PROJECTS:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects',
      error: error?.message,
    });
  }
};

// // 3. Get Single Project by ID
// export const getProjectById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       res.status(404).json({ message: 'Project not found' });
//       return;
//     }
//     res.status(200).json(project);
//   } catch (error: any) {
//     res.status(500).json({ message: 'Server error', error: error?.message });
//   }
// };


// Get logged-in client's posted projects
export const getMyProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id || req.user?.id || req.user;

    // createdBy ফিল্ড অনুযায়ী লগইন করা ক্লায়েন্টের প্রজেক্ট ফিল্টার
    const projects = await Project.find({
      $or: [{ createdBy: userId }, { user: userId }, { client: userId }],
    }).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching client projects', error: error?.message });
  }
};


export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // MongoDB ObjectId validation check
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid Project ID format' });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ message: 'Server error while fetching project details' });
  }
};