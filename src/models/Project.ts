import { Schema, model } from 'mongoose';
import { IProject } from '../types/index.js';

const milestoneSchema = new Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  dueDate: { type: Date, required: true },
  cost: { type: Number, required: true }
});

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true, trim: true },
  clientName: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  status: { type: String, enum: ['scoping', 'in-progress', 'review', 'completed'], default: 'scoping' },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  imageUrl: { type: String, default: '' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  milestones: [milestoneSchema],
  aiAnalysisSummary: { type: String, default: '' }
}, {
  timestamps: true
});

// Create text index to allow easy implementation of the search bar functionality
projectSchema.index({ title: 'text', shortDescription: 'text' });

export const Project = model<IProject>('Project', projectSchema);