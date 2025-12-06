import api from './api';

// Get all members
export const getAllMembers = async (params = {}) => {
  const response = await api.get('/members', { params });
  return response.data;
};

// Get member by ID
export const getMemberById = async (id) => {
  const response = await api.get(`/members/${id}`);
  return response.data;
};

// Create new member
export const createMember = async (memberData) => {
  const response = await api.post('/members', memberData);
  return response.data;
};

// Update member
export const updateMember = async (id, memberData) => {
  const response = await api.put(`/members/${id}`, memberData);
  return response.data;
};

// Delete member
export const deleteMember = async (id) => {
  const response = await api.delete(`/members/${id}`);
  return response.data;
};

// Get member stats
export const getMemberStats = async () => {
  const response = await api.get('/members/stats');
  return response.data;
};
