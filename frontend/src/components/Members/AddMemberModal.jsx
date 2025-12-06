import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { createMember } from '../../services/memberService';

const AddMemberModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    foodTime: '2 times',
    paymentPlan: 'monthly',
    planAmount: 3300,
    address: '',
    emergencyContact: '',
    // Payment fields
    paymentReceived: false,
    paymentMethod: 'cash',
    transactionId: '',
    paymentNotes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let updatedData = { ...formData, [name]: value };

    // Auto-set plan amount based on payment plan
    if (name === 'paymentPlan') {
      switch (value) {
        case 'monthly':
          updatedData.planAmount = 3300;
          break;
        case '15days':
          updatedData.planAmount = 1650;
          break;
        case 'nasta':
          updatedData.planAmount = 500;
          break;
        default:
          updatedData.planAmount = '';
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone) {
      toast.error('Name and phone are required');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (formData.emergencyContact && !/^[0-9]{10}$/.test(formData.emergencyContact)) {
      toast.error('Please enter a valid 10-digit emergency contact');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare member data
      const memberData = {
        name: formData.name,
        phone: formData.phone,
        foodTime: formData.foodTime,
        paymentPlan: formData.paymentPlan,
        planAmount: formData.planAmount,
        address: formData.address,
        emergencyContact: formData.emergencyContact
      };

      // Add payment info if received
      if (formData.paymentReceived) {
        memberData.initialPayment = {
          amount: formData.planAmount,
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId,
          notes: formData.paymentNotes
        };
      }

      const response = await createMember(memberData);
      if (response.success) {
        toast.success(formData.paymentReceived 
          ? 'Member added and payment recorded!' 
          : 'Member added successfully!'
        );
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="label">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter member name"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="10-digit phone number"
              maxLength="10"
              required
            />
          </div>

          {/* Food Time */}
          <div>
            <label className="label">Food Time *</label>
            <select
              name="foodTime"
              value={formData.foodTime}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="1 time">1 Time</option>
              <option value="2 times">2 Times</option>
              <option value="3 times">3 Times</option>
            </select>
          </div>

          {/* Payment Plan */}
          <div>
            <label className="label">Payment Plan *</label>
            <select
              name="paymentPlan"
              value={formData.paymentPlan}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="monthly">Monthly - ₹3300</option>
              <option value="15days">15 Days - ₹1650</option>
              <option value="nasta">Nasta Only - ₹500</option>
              <option value="custom">Custom Amount</option>
            </select>
          </div>

          {/* Plan Amount */}
          <div>
            <label className="label">Plan Amount (₹) *</label>
            <input
              type="number"
              name="planAmount"
              value={formData.planAmount}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter amount"
              min="0"
              required
              readOnly={formData.paymentPlan !== 'custom'}
            />
          </div>

          {/* Address */}
          <div>
            <label className="label">Address (Optional)</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter address"
              rows="3"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="label">Emergency Contact (Optional)</label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="input-field"
              placeholder="10-digit phone number"
              maxLength="10"
            />
          </div>

          {/* Payment Section */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
            
            {/* Payment Received Checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="paymentReceived"
                name="paymentReceived"
                checked={formData.paymentReceived}
                onChange={(e) => setFormData({ ...formData, paymentReceived: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="paymentReceived" className="ml-2 text-sm font-medium text-gray-700">
                Payment received at the time of registration
              </label>
            </div>

            {/* Payment Details - Show only if payment received */}
            {formData.paymentReceived && (
              <div className="space-y-4 bg-green-50 p-4 rounded-lg border border-green-200">
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

                {/* Transaction ID - Show only for non-cash */}
                {formData.paymentMethod !== 'cash' && (
                  <div>
                    <label className="label">Transaction ID</label>
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

                {/* Payment Notes */}
                <div>
                  <label className="label">Payment Notes (Optional)</label>
                  <textarea
                    name="paymentNotes"
                    value={formData.paymentNotes}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Add any notes about the payment"
                    rows="2"
                  />
                </div>

                <div className="bg-white p-3 rounded border border-green-300">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Amount to be recorded:</span> 
                    <span className="text-green-600 text-lg font-bold ml-2">₹{formData.planAmount}</span>
                  </p>
                </div>
              </div>
            )}
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
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
