import Payment from '../models/Payment.js';
import Member from '../models/Member.js';
import ActivityLog from '../models/ActivityLog.js';

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const { memberId, month, year } = req.query;
    let query = {};

    if (memberId) query.member = memberId;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payments = await Payment.find(query)
      .populate('member', 'name phone paymentPlan')
      .sort({ paymentDate: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new payment
export const createPayment = async (req, res) => {
  try {
    const { memberId, amount, paymentDate, paymentMethod, transactionId, notes } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }

    const date = new Date(paymentDate || Date.now());
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const payment = await Payment.create({
      member: memberId,
      amount,
      paymentDate: date,
      paymentMethod,
      transactionId,
      notes,
      month,
      year
    });

    // Update member's payment info
    member.totalPaid = (member.totalPaid || 0) + amount;
    member.lastPaymentDate = date;
    
    // Calculate next payment due
    if (member.paymentPlan === 'monthly') {
      member.nextPaymentDue = new Date(date.setMonth(date.getMonth() + 1));
    } else if (member.paymentPlan === '15days') {
      member.nextPaymentDue = new Date(date.setDate(date.getDate() + 15));
    }

    await member.save();

    // Log activity
    await ActivityLog.create({
      action: 'CREATE',
      entity: 'payment',
      entityId: payment._id,
      description: `Payment of ₹${amount} received from ${member.name}`
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get member payment history
export const getMemberPayments = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    const payments = await Payment.find({ member: memberId })
      .sort({ paymentDate: -1 });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      success: true,
      data: {
        payments,
        totalPaid
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment statistics
export const getPaymentStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let matchQuery = {};
    if (month && year) {
      matchQuery = {
        month: parseInt(month),
        year: parseInt(year)
      };
    }

    const stats = await Payment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalPayments: { $sum: 1 },
          averagePayment: { $avg: '$amount' }
        }
      }
    ]);

    // Get monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get payment method distribution
    const paymentMethodStats = await Payment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        currentPeriod: stats[0] || { totalRevenue: 0, totalPayments: 0, averagePayment: 0 },
        monthlyRevenue,
        paymentMethodStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending payments
export const getPendingPayments = async (req, res) => {
  try {
    const today = new Date();
    
    const members = await Member.find({
      isActive: true,
      nextPaymentDue: { $lte: today }
    }).select('name phone paymentPlan planAmount nextPaymentDue outstandingBalance');

    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    // Update member's total paid
    const member = await Member.findById(payment.member);
    if (member) {
      member.totalPaid = Math.max(0, (member.totalPaid || 0) - payment.amount);
      await member.save();
    }

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
