// import { Schema, model } from 'mongoose';
// import { IProject } from '../types/index.js';

// const milestoneSchema = new Schema({
//   title: { type: String, required: true },
//   status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
//   dueDate: { type: Date, required: true },
//   cost: { type: Number, required: true }
// });

// const projectSchema = new Schema<IProject>({
//   title: { type: String, required: true, trim: true },
//   clientName: { type: String, required: true },
//   shortDescription: { type: String, required: true },
//   fullDescription: { type: String, required: true },
//   status: { type: String, enum: ['scoping', 'in-progress', 'review', 'completed'], default: 'scoping' },
//   budget: { type: Number, required: true },
//   deadline: { type: Date, required: true },
//   imageUrl: { type: String, default: '' },
//   owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   milestones: [milestoneSchema],
//   aiAnalysisSummary: { type: String, default: '' }
// }, {
//   timestamps: true
// });

// // Create text index to allow easy implementation of the search bar functionality
// projectSchema.index({ title: 'text', shortDescription: 'text' });

// export const Project = model<IProject>('Project', projectSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  budget: number;
  skills: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const projectSchema: Schema<IProject> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    skills: [{ type: String, required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>('Project', projectSchema);
export default Project;