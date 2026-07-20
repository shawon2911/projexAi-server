import { Schema, model } from 'mongoose';
import { IUser } from '../types/index.js'; // We will define types shortly

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['freelancer', 'client'], default: 'freelancer' },
}, {
  timestamps: true
});

export const User = model<IUser>('User', userSchema);