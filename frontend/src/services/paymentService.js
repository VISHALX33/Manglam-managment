import api from './api';

// Get all payments
export const getAllPayments = async (params = {}) => {
  const response = await api.get('/payments', { params });
  return response.data;
};

// Create new payment
export const createPayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

// Get member payments
export const getMemberPayments = async (memberId) => {
  const response = await api.get(`/payments/member/${memberId}`);
  return response.data;
};

// Get payment stats
export const getPaymentStats = async (month, year) => {
  const response = await api.get('/payments/stats', {
    params: { month, year }
  });
  return response.data;
};

// Get pending payments
export const getPendingPayments = async () => {
  const response = await api.get('/payments/pending');
  return response.data;
};

// Delete payment
export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};
