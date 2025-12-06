import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaMoneyBillWave, FaFilter } from 'react-icons/fa';
import { getAllPayments, getPaymentStats } from '../services/paymentService';
import { getAllMembers } from '../services/memberService';
import AddPaymentModal from '../components/Payments/AddPaymentModal';
import PaymentStats from '../components/Payments/PaymentStats';
import { format } from 'date-fns';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, [selectedMonth, selectedYear, selectedMember]);

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();
      if (response.success) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {
        month: selectedMonth,
        year: selectedYear
      };
      if (selectedMember) {
        params.memberId = selectedMember;
      }

      const response = await getAllPayments(params);
      if (response.success) {
        setPayments(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await getPaymentStats(selectedMonth, selectedYear);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  const getPaymentMethodBadge = (method) => {
    const badges = {
      cash: 'bg-green-100 text-green-800',
      upi: 'bg-blue-100 text-blue-800',
      card: 'bg-purple-100 text-purple-800',
      bank_transfer: 'bg-orange-100 text-orange-800'
    };
    return badges[method] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: 'Cash',
      upi: 'UPI',
      card: 'Card',
      bank_transfer: 'Bank Transfer'
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payments Management</h1>
          <p className="text-gray-600 mt-2">Track and manage all payment transactions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto"
        >
          <FaPlus />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Stats */}
      {stats && <PaymentStats stats={stats} />}

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <FaFilter className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Member</label>
            <select
              className="input-field"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">All Members</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Payment History</h3>
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{payments.length} payments</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payments found for the selected period</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Method
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Transaction ID
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.member?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.member?.phone || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-green-600">
                        ₹{payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className={`badge ${getPaymentMethodBadge(payment.paymentMethod)}`}>
                        {getPaymentMethodLabel(payment.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {payment.transactionId || '-'}
                    </td>
                    <td className="px-3 md:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {payment.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <AddPaymentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          members={members}
          onSuccess={() => {
            fetchPayments();
            fetchPaymentStats();
          }}
        />
      )}
    </div>
  );
};

export default Payments;
