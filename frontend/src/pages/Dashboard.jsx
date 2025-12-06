import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaMoneyBillWave, 
  FaClipboardCheck, 
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { getDashboardStats } from '../services/dashboardService';
import StatsCard from '../components/Dashboard/StatsCard';
import RevenueChart from '../components/Dashboard/RevenueChart';
import FoodDistributionChart from '../components/Dashboard/FoodDistributionChart';
import PaymentPlanChart from '../components/Dashboard/PaymentPlanChart';
import RecentMembers from '../components/Dashboard/RecentMembers';
import ActivityLog from '../components/Dashboard/ActivityLog';
import PendingPaymentsList from '../components/Dashboard/PendingPaymentsList';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={stats.members.total}
          icon={FaUsers}
          iconColor="bg-blue-500"
          subtitle={`${stats.members.active} active`}
          trend={stats.members.active > stats.members.inactive ? 'up' : 'down'}
        />

        <StatsCard
          title="This Month Revenue"
          value={`₹${stats.revenue.currentMonth.toLocaleString()}`}
          icon={FaMoneyBillWave}
          iconColor="bg-green-500"
          subtitle={`${stats.revenue.paymentsThisMonth} payments`}
          trend="up"
        />

        <StatsCard
          title="Today's Attendance"
          value={stats.attendance.presentToday}
          icon={FaClipboardCheck}
          iconColor="bg-purple-500"
          subtitle={`${stats.attendance.totalMarked} marked`}
          trend="neutral"
        />

        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={FaExclamationTriangle}
          iconColor="bg-red-500"
          subtitle="Overdue"
          trend={stats.pendingPayments > 0 ? 'down' : 'up'}
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend (Last 6 Months)</h3>
          <RevenueChart data={stats.monthlyRevenue} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Food Time Distribution</h3>
            <FoodDistributionChart data={stats.foodTimeDistribution} />
          </div>
        </div>
      </div>

      {/* Payment Plan Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Plan Distribution</h3>
        <PaymentPlanChart data={stats.paymentPlanDistribution} />
      </div>

      {/* Recent Members and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMembers members={stats.recentMembers} />
        <ActivityLog activities={stats.recentActivities} />
      </div>

      {/* Pending Payments */}
      {stats.pendingPayments > 0 && (
        <PendingPaymentsList />
      )}

      {/* Summary Stats */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-primary-100 text-sm uppercase tracking-wide">Total Revenue</p>
            <p className="text-2xl md:text-4xl font-bold mt-2">₹{stats.revenue.total.toLocaleString()}</p>
          </div>
          <div className="text-center md:border-l md:border-primary-500">
            <p className="text-primary-100 text-sm uppercase tracking-wide">Expected Monthly</p>
            <p className="text-2xl md:text-4xl font-bold mt-2">₹{stats.revenue.expectedMonthly?.toLocaleString() || 0}</p>
          </div>
          <div className="text-center md:border-l md:border-primary-500">
            <p className="text-primary-100 text-sm uppercase tracking-wide">Active Members</p>
            <p className="text-2xl md:text-4xl font-bold mt-2">{stats.members.active}</p>
          </div>
          <div className="text-center md:border-l md:border-primary-500">
            <p className="text-primary-100 text-sm uppercase tracking-wide">This Month</p>
            <p className="text-2xl md:text-4xl font-bold mt-2">₹{stats.revenue.currentMonth.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
