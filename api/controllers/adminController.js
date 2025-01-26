import Loan from '../models/loanModal.js';
import { generateToken } from '../utils/tokenGenerator.js';

const adminController = {
  async getAllApplications(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: ['user', 'guarantors']
      };

      const applications = await Loan.paginate({}, options);

      res.json({
        applications: applications.docs,
        totalPages: applications.totalPages,
        currentPage: applications.page
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to retrieve applications', 
        error: error.message 
      });
    }
  },

  async filterApplications(req, res) {
    try {
      const { city, status, category, page = 1, limit = 10 } = req.body;

      const filter = {};
      if (city) filter['user.city'] = { $regex: city, $options: 'i' };
      if (status) filter.status = status;
      if (category) filter.category = category;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: ['user', 'guarantors']
      };

      const applications = await Loan.paginate(filter, options);

      res.json({
        applications: applications.docs,
        totalPages: applications.totalPages,
        currentPage: applications.page
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to filter applications', 
        error: error.message 
      });
    }
  },

  async updateLoanStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, comments } = req.body;

      const loan = await Loan.findByIdAndUpdate(
        id, 
        { 
          status, 
          adminComments: comments 
        }, 
        { new: true }
      );

      if (!loan) {
        return res.status(404).json({ message: 'Loan application not found' });
      }

      res.json({
        message: 'Loan status updated successfully',
        loan
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to update loan status', 
        error: error.message 
      });
    }
  },

  async generateApplicationToken(req, res) {
    try {
      const { id } = req.params;

      const loan = await Loan.findById(id);
      if (!loan) {
        return res.status(404).json({ message: 'Loan application not found' });
      }

      const token = generateToken(loan._id);

      res.json({ token });
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to generate application token', 
        error: error.message 
      });
    }
  },

  async getDashboardStatistics(req, res) {
    try {
      const totalApplications = await Loan.countDocuments();
      const approvedApplications = await Loan.countDocuments({ status: 'APPROVED' });
      const rejectedApplications = await Loan.countDocuments({ status: 'REJECTED' });
      const pendingApplications = await Loan.countDocuments({ status: 'IN_REVIEW' });

      res.json({
        totalApplications,
        approvedApplications,
        rejectedApplications,
        pendingApplications
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to retrieve dashboard statistics', 
        error: error.message 
      });
    }
  }
};

export default adminController;