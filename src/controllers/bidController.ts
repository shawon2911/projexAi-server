import { Request, Response } from 'express';
import Bid from '../models/Bids';

// 1. Submit a new proposal / bid
export const submitBid = async (req: Request, res: Response) => {
  try {
    const { projectId, amount, bidAmount, proposal, coverLetter, freelancerId } = req.body;

    const finalAmount = amount || bidAmount;
    const finalProposal = proposal || coverLetter;
    const activeFreelancerId = (req as any).user?._id || (req as any).user?.id || freelancerId;

    if (!activeFreelancerId) {
      return res.status(400).json({ 
        message: 'Freelancer ID is required. Please ensure you are logged in.' 
      });
    }

    if (!projectId || !finalAmount || !finalProposal) {
      return res.status(400).json({ message: 'ProjectId, amount, and proposal are required fields.' });
    }

    const newBid = new Bid({
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
  } catch (error: unknown) {
    console.error('Error submitting bid:', error);
    return res.status(500).json({ message: 'Server error while submitting proposal.' });
  }
};

// 2. Fetch all bids for a specific project
export const getBidsByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const bids = await Bid.find({ project: projectId })
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(bids);
  } catch (error: unknown) {
    console.error('Error fetching bids:', error);
    return res.status(500).json({ message: 'Failed to fetch bids.' });
  }
};