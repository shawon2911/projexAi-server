"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const milestoneSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    dueDate: { type: Date, required: true },
    cost: { type: Number, required: true }
});
const projectSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    clientName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    status: { type: String, enum: ['scoping', 'in-progress', 'review', 'completed'], default: 'scoping' },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    imageUrl: { type: String, default: '' },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    milestones: [milestoneSchema],
    aiAnalysisSummary: { type: String, default: '' }
}, {
    timestamps: true
});
// Create text index to allow easy implementation of the search bar functionality
projectSchema.index({ title: 'text', shortDescription: 'text' });
exports.Project = (0, mongoose_1.model)('Project', projectSchema);
