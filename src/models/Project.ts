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