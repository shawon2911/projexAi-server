"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const mongoose_1 = require("mongoose");
const chatMessageSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    sender: { type: String, enum: ['user', 'ai'], required: true },
    message: { type: String, required: true },
}, {
    timestamps: true
});
exports.ChatMessage = (0, mongoose_1.model)('ChatMessage', chatMessageSchema);
