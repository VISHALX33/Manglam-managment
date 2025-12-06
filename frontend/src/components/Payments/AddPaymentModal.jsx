import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { createPayment } from '../../services/paymentService';

const AddPaymentModal = ({ isOpen, onClose, members, onSuccess }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    transactionId: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-fill amount based on selected member
    if (name === 'memberId') {
      const selectedMember = members.find(m => m._id === value);
      if (selectedMember) {
        setFormData(prev => ({
          ...prev,
          memberId: value,
          amount: selectedMember.planAmount
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.memberId) {
      toast.error('Please select a member');
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const response = await createPayment({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      if (response.success) {
        toast.success('Payment recorded successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedMember = members.find(m => m._id === formData.memberId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Record Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Select Member */}
          <div>
            <label className="label">Select Member *</label>
            <select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Choose a member...</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name} - {member.phone} (₹{member.planAmount})
                </option>
              ))}
            </select>
          </div>

          {/* Member Info */}
          {selectedMember && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-blue-600 font-medium">Payment Plan</p>
                  <p className="text-blue-900 capitalize">{selectedMember.paymentPlan}</p>
                </div>
                <div>
                  <p className="text-blue-600 font-medium">Food Time</p>
                  <p className="text-blue-900">{selectedMember.foodTime}</p>
                </div>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="label">Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Payment Date */}
          <div>
            <label className="label">Payment Date *</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="label">Payment Method *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Transaction ID */}
          {formData.paymentMethod !== 'cash' && (
            <div>
              <label className="label">Transaction ID (Optional)</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="label">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field"
              placeholder="Add any notes..."
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
