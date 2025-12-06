import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPendingPayments } from '../../services/paymentService';
import { format } from 'date-fns';
import { FaExclamationTriangle, FaPhone } from 'react-icons/fa';

const PendingPaymentsList = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const response = await getPendingPayments();
      if (response.success) {
        setPendingPayments(response.data);
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (pendingPayments.length === 0) return null;

  return (
    <div className="card bg-red-50 border-2 border-red-200">
      <div className="flex items-center space-x-2 mb-4">
        <FaExclamationTriangle className="text-red-600 text-xl" />
        <h3 className="text-lg font-semibold text-red-800">Pending Payments</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingPayments.map((member) => (
          <div 
            key={member._id}
            className="bg-white p-4 rounded-lg border border-red-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-800">{member.name}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <FaPhone className="text-xs" />
                  <span>{member.phone}</span>
                </div>
              </div>
              <span className="badge badge-danger">Overdue</span>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plan Amount:</span>
                <span className="font-semibold text-gray-800">₹{member.planAmount}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Due Date:</span>
                <span className="text-red-600 font-medium">
                  {format(new Date(member.nextPaymentDue), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingPaymentsList;
