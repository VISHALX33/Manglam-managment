import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCalendar, FaCheck, FaTimes, FaUserCheck } from 'react-icons/fa';
import { getAllMembers } from '../services/memberService';
import { getMonthlyAttendance, markAttendance, bulkMarkAttendance, getTodayAttendance } from '../services/attendanceService';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';

const Attendance = () => {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayData, setTodayData] = useState({ marked: [], unmarked: [] });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('today'); // 'today' or 'monthly'

  const currentMonth = selectedDate.getMonth() + 1;
  const currentYear = selectedDate.getFullYear();
  const daysInMonth = getDaysInMonth(selectedDate);

  useEffect(() => {
    fetchMembers();
    if (view === 'today') {
      fetchTodayAttendance();
    } else {
      fetchMonthlyAttendance();
    }
  }, [view, selectedDate]);

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers({ isActive: 'true' });
      if (response.success) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await getTodayAttendance();
      if (response.success) {
        setTodayData(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch today\'s attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyAttendance = async () => {
    try {
      setLoading(true);
      const response = await getMonthlyAttendance(currentMonth, currentYear);
      if (response.success) {
        // Create attendance map
        const attendanceMap = {};
        response.data.forEach(record => {
          const key = `${record.member._id}-${new Date(record.date).getDate()}`;
          attendanceMap[key] = record.status;
        });
        setAttendance(attendanceMap);
      }
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (memberId, status) => {
    try {
      const response = await markAttendance({
        memberId,
        date: new Date(),
        status
      });
      if (response.success) {
        toast.success('Attendance marked successfully');
        fetchTodayAttendance();
      }
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const handleBulkMark = async (status) => {
    if (window.confirm(`Mark all unmarked members as ${status}?`)) {
      try {
        const memberIds = todayData.unmarked.map(m => m._id);
        const response = await bulkMarkAttendance({
          date: new Date(),
          members: memberIds,
          status
        });
        if (response.success) {
          toast.success(`All members marked as ${status}`);
          fetchTodayAttendance();
        }
      } catch (error) {
        toast.error('Failed to mark bulk attendance');
      }
    }
  };

  const handleCellClick = async (memberId, day) => {
    const date = new Date(currentYear, currentMonth - 1, day);
    const key = `${memberId}-${day}`;
    const currentStatus = attendance[key];
    
    // Cycle through: present -> absent -> holiday -> undefined -> present
    let newStatus;
    if (currentStatus === 'present') {
      newStatus = 'absent';
    } else if (currentStatus === 'absent') {
      newStatus = 'holiday';
    } else {
      newStatus = 'present';
    }

    try {
      await markAttendance({
        memberId,
        date,
        status: newStatus
      });
      
      // Update local state
      setAttendance(prev => ({
        ...prev,
        [key]: newStatus
      }));
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const getCellColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'holiday':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };

  const getCellSymbol = (status) => {
    switch (status) {
      case 'present':
        return 'P';
      case 'absent':
        return 'A';
      case 'holiday':
        return 'H';
      default:
        return '-';
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Track and manage member attendance</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setView('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'today' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Today's Attendance
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'monthly' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Monthly View
          </button>
        </div>
      </div>

      {/* Today's Attendance View */}
      {view === 'today' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-green-50 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Present Today</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">
                    {todayData.marked.filter(a => a.status === 'present').length}
                  </p>
                </div>
                <FaCheck className="text-4xl text-green-500" />
              </div>
            </div>

            <div className="card bg-red-50 border-2 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Absent Today</p>
                  <p className="text-3xl font-bold text-red-700 mt-2">
                    {todayData.marked.filter(a => a.status === 'absent').length}
                  </p>
                </div>
                <FaTimes className="text-4xl text-red-500" />
              </div>
            </div>

            <div className="card bg-yellow-50 border-2 border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Not Marked</p>
                  <p className="text-3xl font-bold text-yellow-700 mt-2">
                    {todayData.unmarked.length}
                  </p>
                </div>
                <FaUserCheck className="text-4xl text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {todayData.unmarked.length > 0 && (
            <div className="card bg-blue-50 border-2 border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-blue-800 font-medium">Quick Actions for Unmarked Members</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleBulkMark('present')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => handleBulkMark('absent')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Unmarked Members */}
          {todayData.unmarked.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Unmarked Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayData.unmarked.map(member => (
                  <div key={member._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.phone}</p>
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleMarkAttendance(member._id, 'present')}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(member._id, 'absent')}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marked Members */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Marked Attendance</h3>
            {todayData.marked.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayData.marked.map(record => (
                  <div key={record._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{record.member.name}</p>
                        <p className="text-sm text-gray-600">{record.member.phone}</p>
                      </div>
                      <span className={`badge ${record.status === 'present' ? 'badge-success' : 'badge-danger'}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No attendance marked yet</p>
            )}
          </div>
        </div>
      )}

      {/* Monthly View */}
      {view === 'monthly' && (
        <div className="space-y-4">
          {/* Month Selector */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FaCalendar className="text-primary-600 text-xl" />
                <input
                  type="month"
                  value={format(selectedDate, 'yyyy-MM')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="input-field w-auto"
                />
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span>Holiday</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Grid */}
          <div className="card overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">
                      Member
                    </th>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                      <th key={day} className="px-2 py-3 text-center text-xs font-medium text-gray-500">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map(member => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="sticky left-0 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 z-10">
                        {member.name}
                      </td>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const key = `${member._id}-${day}`;
                        const status = attendance[key];
                        return (
                          <td 
                            key={day}
                            onClick={() => handleCellClick(member._id, day)}
                            className={`px-2 py-3 text-center text-sm cursor-pointer transition-colors border ${getCellColor(status)}`}
                          >
                            {getCellSymbol(status)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card bg-blue-50">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Click on any cell to mark attendance. Click again to cycle through: Present → Absent → Holiday → Unmarked
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
