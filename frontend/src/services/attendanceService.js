import api from './api';

// Get monthly attendance
export const getMonthlyAttendance = async (month, year) => {
  const response = await api.get('/attendance/monthly', {
    params: { month, year }
  });
  return response.data;
};

// Mark attendance
export const markAttendance = async (attendanceData) => {
  const response = await api.post('/attendance/mark', attendanceData);
  return response.data;
};

// Bulk mark attendance
export const bulkMarkAttendance = async (data) => {
  const response = await api.post('/attendance/bulk-mark', data);
  return response.data;
};

// Get member attendance
export const getMemberAttendance = async (memberId, month, year) => {
  const response = await api.get(`/attendance/member/${memberId}`, {
    params: { month, year }
  });
  return response.data;
};

// Get today's attendance
export const getTodayAttendance = async () => {
  const response = await api.get('/attendance/today');
  return response.data;
};

// Get attendance stats
export const getAttendanceStats = async (month, year) => {
  const response = await api.get('/attendance/stats', {
    params: { month, year }
  });
  return response.data;
};
