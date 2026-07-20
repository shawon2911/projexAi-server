import { Schema, model } from 'mongoose';
import { IChatMessage } from '../types/index.js';

const chatMessageSchema = new Schema<IChatMessage>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  sender: { type: String, enum: ['user', 'ai'], required: true },
  message: { type: String, required: true },
}, {
  timestamps: true
});

export const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema);