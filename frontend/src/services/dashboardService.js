import api from './api';

// Get dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// Get activity logs
export const getActivityLogs = async (params = {}) => {
  const response = await api.get('/dashboard/activities', { params });
  return response.data;
};
