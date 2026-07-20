import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: 'freelancer' | 'client';
  createdAt: Date;
  updatedAt: Date;
}

export interface IMilestone {
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  cost: number;
}

export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  clientName: string;
  shortDescription: string;
  fullDescription: string;
  status: 'scoping' | 'in-progress' | 'review' | 'completed';
  budget: number;
  deadline: Date;
  imageUrl?: string;
  owner: Types.ObjectId;
  milestones: IMilestone[];
  aiAnalysisSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage extends Document {
  projectId: Types.ObjectId;
  sender: 'user' | 'ai';
  message: string;
  createdAt: Date;
}