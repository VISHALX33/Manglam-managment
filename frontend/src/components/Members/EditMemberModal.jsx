import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { updateMember } from '../../services/memberService';

const EditMemberModal = ({ isOpen, onClose, member, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    foodTime: '2 times',
    paymentPlan: 'monthly',
    planAmount: 3300,
    address: '',
    emergencyContact: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        phone: member.phone || '',
        foodTime: member.foodTime || '2 times',
        paymentPlan: member.paymentPlan || 'monthly',
        planAmount: member.planAmount || 3300,
        address: member.address || '',
        emergencyContact: member.emergencyContact || '',
        isActive: member.isActive !== undefined ? member.isActive : true
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let updatedData = { 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    };

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
          break;
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
      const response = await updateMember(member._id, formData);
      if (response.success) {
        toast.success('Member updated successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update member');
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
          <h2 className="text-2xl font-bold text-gray-800">Edit Member</h2>
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

          {/* Active Status */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active Member
            </label>
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
              {loading ? 'Updating...' : 'Update Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;
