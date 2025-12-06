import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaFileDownload, FaChartBar, FaCalendar } from 'react-icons/fa';
import { getPaymentStats } from '../services/paymentService';
import { getMemberStats } from '../services/memberService';
import { getAttendanceStats } from '../services/attendanceService';
import { format } from 'date-fns';

const Reports = () => {
  const [reportType, setReportType] = useState('revenue');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [paymentStats, setPaymentStats] = useState(null);
  const [memberStats, setMemberStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [reportType, selectedMonth, selectedYear]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const [paymentRes, memberRes, attendanceRes] = await Promise.all([
        getPaymentStats(selectedMonth, selectedYear),
        getMemberStats(),
        getAttendanceStats(selectedMonth, selectedYear)
      ]);

      if (paymentRes.success) setPaymentStats(paymentRes.data);
      if (memberRes.success) setMemberStats(memberRes.data);
      if (attendanceRes.success) setAttendanceStats(attendanceRes.data);
    } catch (error) {
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    toast.info(`Exporting ${type} report...`);
    // Export functionality would be implemented here
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate and download comprehensive reports</p>
        </div>
        <button
          onClick={() => handleExport(reportType)}
          className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto"
        >
          <FaFileDownload />
          <span>Export Report</span>
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <FaChartBar className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Select Report Type</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setReportType('revenue')}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === 'revenue'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <p className={`font-semibold ${reportType === 'revenue' ? 'text-primary-700' : 'text-gray-700'}`}>
              Revenue Report
            </p>
            <p className="text-sm text-gray-500 mt-1">Payment collection summary</p>
          </button>

          <button
            onClick={() => setReportType('attendance')}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === 'attendance'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <p className={`font-semibold ${reportType === 'attendance' ? 'text-primary-700' : 'text-gray-700'}`}>
              Attendance Report
            </p>
            <p className="text-sm text-gray-500 mt-1">Member attendance details</p>
          </button>

          <button
            onClick={() => setReportType('members')}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === 'members'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <p className={`font-semibold ${reportType === 'members' ? 'text-primary-700' : 'text-gray-700'}`}>
              Member Report
            </p>
            <p className="text-sm text-gray-500 mt-1">Member statistics & distribution</p>
          </button>

          <button
            onClick={() => setReportType('comprehensive')}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === 'comprehensive'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <p className={`font-semibold ${reportType === 'comprehensive' ? 'text-primary-700' : 'text-gray-700'}`}>
              Comprehensive
            </p>
            <p className="text-sm text-gray-500 mt-1">Complete overview</p>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <FaCalendar className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Select Period</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Month</label>
            <select
              className="input-field"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {format(new Date(2024, month - 1), 'MMMM')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Year</label>
            <select
              className="input-field"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[2023, 2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Revenue Report */}
          {(reportType === 'revenue' || reportType === 'comprehensive') && paymentStats && (
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">
                    ₹{paymentStats.currentPeriod?.totalRevenue?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">Total Payments</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">
                    {paymentStats.currentPeriod?.totalPayments || 0}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <p className="text-sm text-purple-600 font-medium">Average Payment</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">
                    ₹{Math.round(paymentStats.currentPeriod?.averagePayment || 0)}
                  </p>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentStats.paymentMethodStats?.map((method) => (
                    <div key={method._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium capitalize">
                          {method._id.replace('_', ' ')}
                        </span>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ₹{method.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">{method.count} transactions</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend */}
              {paymentStats.monthlyRevenue && paymentStats.monthlyRevenue.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trend (Last 6 Months)</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payments</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentStats.monthlyRevenue.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {format(new Date(item._id.year, item._id.month - 1), 'MMMM yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              ₹{item.revenue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attendance Report */}
          {(reportType === 'attendance' || reportType === 'comprehensive') && attendanceStats && (
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Attendance Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {attendanceStats.data?.map((stat) => (
                  <div 
                    key={stat._id} 
                    className={`p-4 rounded-lg border-2 ${
                      stat._id === 'present' ? 'bg-green-50 border-green-200' :
                      stat._id === 'absent' ? 'bg-red-50 border-red-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <p className={`text-sm font-medium ${
                      stat._id === 'present' ? 'text-green-600' :
                      stat._id === 'absent' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {stat._id.toUpperCase()}
                    </p>
                    <p className={`text-3xl font-bold mt-2 ${
                      stat._id === 'present' ? 'text-green-700' :
                      stat._id === 'absent' ? 'text-red-700' :
                      'text-gray-700'
                    }`}>
                      {stat.count}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Report */}
          {(reportType === 'members' || reportType === 'comprehensive') && memberStats && (
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Member Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">Total Members</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">
                    {memberStats.totalMembers}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-green-600 font-medium">Active Members</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">
                    {memberStats.activeMembers}
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <p className="text-sm text-red-600 font-medium">Inactive Members</p>
                  <p className="text-3xl font-bold text-red-700 mt-2">
                    {memberStats.inactiveMembers}
                  </p>
                </div>
              </div>

              {/* Food Time Distribution */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Food Time Distribution</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {memberStats.foodTimeDistribution?.map((item) => (
                    <div key={item._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{item._id}</span>
                        <span className="text-2xl font-bold text-primary-600">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Plan Distribution */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Plan Distribution</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {memberStats.paymentPlanDistribution?.map((item) => (
                    <div key={item._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium capitalize">{item._id}</span>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary-600">{item.count}</p>
                          <p className="text-sm text-gray-500">members</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Export Options */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('pdf')}
            className="btn-primary"
          >
            Export as PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="btn-primary"
          >
            Export as Excel
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="btn-primary"
          >
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
