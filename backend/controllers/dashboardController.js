import Member from '../models/Member.js';
import Payment from '../models/Payment.js';
import Attendance from '../models/Attendance.js';
import ActivityLog from '../models/ActivityLog.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Member stats
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ isActive: true });
    const inactiveMembers = await Member.countDocuments({ isActive: false });

    // Calculate expected total amount from all active members
    const expectedRevenueResult = await Member.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          expectedTotal: { $sum: '$planAmount' }
        }
      }
    ]);
    const expectedMonthlyRevenue = expectedRevenueResult[0]?.expectedTotal || 0;

    // Payment stats - current month
    const monthlyPayments = await Payment.aggregate([
      {
        $match: {
          month: currentMonth,
          year: currentYear
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Total revenue (all time)
    const totalRevenueResult = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Today's attendance
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.find({ date: today });
    const presentToday = todayAttendance.filter(a => a.status === 'present').length;

    // Pending payments
    const pendingPayments = await Member.countDocuments({
      isActive: true,
      nextPaymentDue: { $lte: new Date() }
    });

    // Food time distribution
    const foodTimeDistribution = await Member.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$foodTime', count: { $sum: 1 } } }
    ]);

    // Payment plan distribution
    const paymentPlanDistribution = await Member.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$paymentPlan', count: { $sum: 1 }, totalAmount: { $sum: '$planAmount' } } }
    ]);

    // Monthly revenue for last 6 months
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

    // Recent activities
    const recentActivities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Recent members
    const recentMembers = await Member.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name phone foodTime paymentPlan createdAt');

    res.json({
      success: true,
      data: {
        members: {
          total: totalMembers,
          active: activeMembers,
          inactive: inactiveMembers
        },
        revenue: {
          currentMonth: monthlyPayments[0]?.totalRevenue || 0,
          total: totalRevenueResult[0]?.total || 0,
          paymentsThisMonth: monthlyPayments[0]?.count || 0,
          expectedMonthly: expectedMonthlyRevenue
        },
        attendance: {
          presentToday,
          totalMarked: todayAttendance.length
        },
        pendingPayments,
        foodTimeDistribution,
        paymentPlanDistribution,
        monthlyRevenue,
        recentActivities,
        recentMembers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const { limit = 20, entity } = req.query;
    
    let query = {};
    if (entity) query.entity = entity;

    const activities = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
