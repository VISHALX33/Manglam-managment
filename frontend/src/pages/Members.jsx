import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaPhone, FaUtensils } from 'react-icons/fa';
import { getAllMembers, deleteMember } from '../services/memberService';
import AddMemberModal from '../components/Members/AddMemberModal';
import EditMemberModal from '../components/Members/EditMemberModal';
import { format } from 'date-fns';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [searchTerm, filterPlan, filterActive]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterPlan) params.paymentPlan = filterPlan;
      if (filterActive) params.isActive = filterActive;

      const response = await getAllMembers(params);
      if (response.success) {
        setMembers(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await deleteMember(id);
        if (response.success) {
          toast.success('Member deleted successfully');
          fetchMembers();
        }
      } catch (error) {
        toast.error('Failed to delete member');
      }
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const getPlanBadge = (plan) => {
    const badges = {
      monthly: 'bg-blue-100 text-blue-800',
      '15days': 'bg-purple-100 text-purple-800',
      nasta: 'bg-yellow-100 text-yellow-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return badges[plan] || 'bg-gray-100 text-gray-800';
  };

  const getPlanLabel = (plan, amount) => {
    const labels = {
      monthly: 'Monthly',
      '15days': '15 Days',
      nasta: 'Nasta Only',
      custom: 'Custom'
    };
    return `${labels[plan] || plan} - ₹${amount}`;
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Members Management</h1>
          <p className="text-gray-600 mt-2">Manage all member details and information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto"
        >
          <FaPlus />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative col-span-2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Payment Plan Filter */}
          <select
            className="input-field"
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
          >
            <option value="">All Payment Plans</option>
            <option value="monthly">Monthly</option>
            <option value="15days">15 Days</option>
            <option value="nasta">Nasta Only</option>
            <option value="custom">Custom</option>
          </select>

          {/* Status Filter */}
          <select
            className="input-field"
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No members found</p>
            </div>
          ) : (
           <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Food Time</th>
      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Payment Plan</th>
      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joining Date</th>

      {/* NEW FIELDS */}
      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Last Payment</th>
      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Next Due</th>
      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Balance</th>

      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>

  <tbody className="bg-white divide-y divide-gray-200">
    {members.map((member) => (
      <tr key={member._id} className="hover:bg-gray-50 transition-colors">
        
        {/* Member Info */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{member.name}</div>
              <div className="text-xs text-gray-500">{member.address || ''}</div>
              <div className="text-xs text-gray-500">
                {member.emergencyContact ? `Emergency: ${member.emergencyContact}` : ''}
              </div>
            </div>
          </div>
        </td>

        {/* Phone */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-gray-900">
            {member.phone}
          </div>
        </td>

        {/* Food Time */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
          <span className="badge badge-info">{member.foodTime || 'N/A'}</span>
        </td>

        {/* Payment Plan */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
          <span className={`badge ${getPlanBadge(member.paymentPlan)}`}>
            {getPlanLabel(member.paymentPlan, member.planAmount)}
          </span>
        </td>

        {/* Joining Date */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
          {format(new Date(member.joiningDate), 'MMM dd, yyyy')}
        </td>

        {/* Last Payment */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
          {member.lastPaymentDate ? format(new Date(member.lastPaymentDate), 'MMM dd, yyyy') : '—'}
        </td>

        {/* Next Due */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
          {member.nextPaymentDue ? format(new Date(member.nextPaymentDue), 'MMM dd, yyyy') : '—'}
        </td>

        {/* Balance */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
          ₹{member.outstandingBalance || 0}
        </td>

        {/* Status */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          <span className={`badge ${member.isActive ? 'badge-success' : 'badge-danger'}`}>
            {member.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>

        {/* Actions */}
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          <div className="flex space-x-2">
            <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-900">
              <FaEdit className="text-lg" />
            </button>
            <button onClick={() => handleDelete(member._id, member.name)} className="text-red-600 hover:text-red-900">
              <FaTrash className="text-lg" />
            </button>
          </div>
        </td>

      </tr>
    ))}
  </tbody>
</table>

          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddMemberModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchMembers}
        />
      )}

      {showEditModal && selectedMember && (
        <EditMemberModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
          onSuccess={fetchMembers}
        />
      )}
    </div>
  );
};

export default Members;
