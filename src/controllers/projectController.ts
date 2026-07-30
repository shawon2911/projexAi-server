// import { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import Project from '../models/Project';

// interface AuthenticatedRequest extends Request {
//   user?: any;
// }

// // 1. Create Project
// export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     if (req.user && req.user.role && req.user.role !== 'client') {
//       res.status(403).json({ success: false, message: 'Access denied. Only clients can post new projects.' });
//       return;
//     }

//     const userId = req.user?._id || req.user?.id || req.user;
//     if (!userId) {
//       res.status(401).json({ success: false, message: 'User authorization failed. Please log in again.' });
//       return;
//     }

//     const { title, category, shortDescription, description, fullDescription, budget, skills } = req.body;
//     const finalDescription = description || fullDescription || shortDescription || '';

//     if (!title || !finalDescription || !budget) {
//       res.status(400).json({ success: false, message: 'Please provide title, description, and budget.' });
//       return;
//     }

//     const processedSkills = Array.isArray(skills)
//       ? skills
//       : typeof skills === 'string'
//       ? skills.split(',').map((s) => s.trim()).filter(Boolean)
//       : [];

//     const newProject = new Project({
//       createdBy: new mongoose.Types.ObjectId(userId),
//       title,
//       category: category || 'Web Development',
//       shortDescription: shortDescription || finalDescription.substring(0, 150),
//       description: finalDescription,
//       budget: Number(budget),
//       skills: processedSkills,
//     });

//     const savedProject = await newProject.save();

//     res.status(201).json({
//       success: true,
//       message: 'Project created successfully',
//       project: savedProject,
//     });
//   } catch (error: any) {
//     console.error('SERVER ERROR IN CREATE PROJECT:', error);
//     res.status(500).json({ success: false, message: 'Server error while creating project', error: error?.message });
//   }
// };

// // 2. Get All Projects (Safe Version)
// export const getProjects = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const projects = await Project.find().sort({ createdAt: -1 });
//     res.status(200).json(projects);
//   } catch (error: any) {
//     console.error('SERVER ERROR IN GET PROJECTS:', error);
//     res.status(500).json({ success: false, message: 'Server error while fetching projects', error: error?.message });
//   }
// };

// // 3. Get Single Project by ID
// export const getProjectById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;

//     if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
//       res.status(400).json({ message: 'Invalid Project ID format' });
//       return;
//     }

//     const project = await Project.findById(id);

//     if (!project) {
//       res.status(404).json({ message: 'Project not found' });
//       return;
//     }

//     res.status(200).json(project);
//   } catch (error: any) {
//     console.error('Error fetching project details:', error);
//     res.status(500).json({ message: 'Server error while fetching project details' });
//   }
// };

// // 4. Get My Projects
// export const getMyProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     const userId = req.user?._id || req.user?.id || req.user;
//     const projects = await Project.find({ createdBy: userId }).sort({ createdAt: -1 });
//     res.status(200).json(projects);
//   } catch (error: any) {
//     res.status(500).json({ message: 'Error fetching client projects', error: error?.message });
//   }
// };







// ---------------------------------------





// import { Request, Response } from 'express';
// import Project from '../models/Project';

// // Custom Interface type for req.user if using Auth Middleware
// interface AuthRequest extends Request {
//   user?: any;
// }

// // 1. Get All Projects
// export const getProjects = async (req: Request, res: Response) => {
//   try {
//     const projects = await Project.find().sort({ createdAt: -1 });
//     res.status(200).json(projects);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message || 'Error fetching projects' });
//   }
// };

// // 2. Get Single Project By ID (এই ফাংশনটি মিসিং থাকার কারণে এরর আসছিল)
// export const getProjectById = async (req: Request, res: Response) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }
//     res.status(200).json(project);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message || 'Error fetching project details' });
//   }
// };

// // 3. Create Project
// // projectController.ts

// export const createProject = async (req: AuthRequest, res: Response) => {
//   try {
//     const { title, category, shortDescription, description, fullDescription, budget, deadline, skills } = req.body;

//     const userId = req.user?._id || req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ message: 'User authorization failed.' });
//     }

//     const newProject = new Project({
//       title,
//       category,
//       shortDescription,
//       description: description || fullDescription,
//       budget,
//       deadline,
//       skills,
//       createdBy: userId, // 👈 💡 এই লাইনটি যুক্ত করা হয়েছে!
//       client: userId,    // যদি client ফিল্ডও থাকে
//       status: 'open',
//     });

//     const savedProject = await newProject.save();
//     res.status(201).json(savedProject);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message || 'Failed to create project' });
//   }
// };

// /// projectController.ts

// export const getMyProjects = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?._id || req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ message: 'User authorization failed.' });
//     }

//     // 💡 createdBy অথবা client দিয়ে খোঁজা হচ্ছে
//     const projects = await Project.find({
//       $or: [{ createdBy: userId }, { client: userId }]
//     }).sort({ createdAt: -1 });

//     res.status(200).json(projects);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message || 'Error fetching my projects' });
//   }
// };




// ----------------------------------




import { Request, Response } from 'express';
import Project from '../models/Project';

export interface AuthRequest extends Request {
  user?: {
    _id?: string;
    id?: string;
    [key: string]: any;
  };
}

// 1. Get All Projects (Public)
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching projects' });
  }
};

// 2. Get Single Project By ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.status(200).json(project);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching project details' });
  }
};

// 3. Create Project (Protected)
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, shortDescription, description, fullDescription, budget, deadline, skills } = req.body;

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User authentication failed' });
    }

    const newProject = new Project({
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
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to create project' });
  }
};

// 4. Get My Projects (Protected)
export const getMyProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User authentication failed' });
    }

    const projects = await Project.find({
      $or: [{ createdBy: userId }, { client: userId }]
    }).sort({ createdAt: -1 });

    return res.status(200).json(projects);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching user projects' });
  }
};