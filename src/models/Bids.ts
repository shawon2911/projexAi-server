import { Schema, model, Document } from 'mongoose';
import mongoose from 'mongoose';

export interface IBid extends Document {
  project: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  amount: number;
  proposal: string;
  createdAt: Date;
}

const bidSchema = new Schema<IBid>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    proposal: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IBid>('Bid', bidSchema);