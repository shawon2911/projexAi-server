"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBidsByProject = exports.submitBid = void 0;
const Bids_1 = __importDefault(require("../models/Bids"));
// 1. Submit a new proposal / bid
const submitBid = async (req, res) => {
    try {
        const { projectId, amount, bidAmount, proposal, coverLetter, freelancerId } = req.body;
        const finalAmount = amount || bidAmount;
        const finalProposal = proposal || coverLetter;
        const activeFreelancerId = req.user?._id || req.user?.id || freelancerId;
        if (!activeFreelancerId) {
            return res.status(400).json({
                message: 'Freelancer ID is required. Please ensure you are logged in.'
            });
        }
        if (!projectId || !finalAmount || !finalProposal) {
            return res.status(400).json({ message: 'ProjectId, amount, and proposal are required fields.' });
        }
        const newBid = new Bids_1.default({
            project: projectId,
            freelancer: activeFreelancerId,
            amount: Number(finalAmount),
            proposal: finalProposal,
        });
        await newBid.save();
        return res.status(201).json({
            message: 'Proposal submitted successfully!',
            bid: newBid,
        });
    }
    catch (error) {
        console.error('Error submitting bid:', error);
        return res.status(500).json({ message: 'Server error while submitting proposal.' });
    }
};
exports.submitBid = submitBid;
// 2. Fetch all bids for a specific project
const getBidsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const bids = await Bids_1.default.find({ project: projectId })
            .populate('freelancer', 'name email')
            .sort({ createdAt: -1 });
        return res.status(200).json(bids);
    }
    catch (error) {
        console.error('Error fetching bids:', error);
        return res.status(500).json({ message: 'Failed to fetch bids.' });
    }
};
exports.getBidsByProject = getBidsByProject;
