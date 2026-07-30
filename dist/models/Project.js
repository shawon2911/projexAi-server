"use strict";
// import { Schema, model } from 'mongoose';
// import { IProject } from '../types/index.js';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
const mongoose_1 = __importStar(require("mongoose"));
const projectSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    skills: [{ type: String, required: true }],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const Project = mongoose_1.default.model('Project', projectSchema);
exports.default = Project;
