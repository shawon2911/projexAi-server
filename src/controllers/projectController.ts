import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Project from '../models/Project';

// Create a new Project (Protected)
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, shortDescription, category, budget, skills } = req.body;

    if (!title || !description || !category || !budget) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    const project = new Project({
      title,
      description,
      shortDescription: shortDescription || description.substring(0, 150) + '...',
      category,
      budget,
      skills: Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim()),
      createdBy: req.user?.id
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error while creating project' });
  }
};

// Get All Projects with Search & Filtering (Public)
export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, category } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: projects.length, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
};