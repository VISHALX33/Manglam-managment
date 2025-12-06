import Attendance from '../models/Attendance.js';
import Member from '../models/Member.js';
import ActivityLog from '../models/ActivityLog.js';

// Get attendance for a specific month
export const getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const attendance = await Attendance.find({
      month: parseInt(month),
      year: parseInt(year)
    }).populate('member', 'name phone foodTime');

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark attendance for a member
export const markAttendance = async (req, res) => {
  try {
    const { memberId, date, status, mealType } = req.body;
    
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const month = attendanceDate.getMonth() + 1;
    const year = attendanceDate.getFullYear();

    // Check if attendance already exists
    const startOfDay = new Date(attendanceDate);
    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    let attendance = await Attendance.findOne({
      member: memberId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (attendance) {
      attendance.status = status;
      attendance.mealType = mealType;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        member: memberId,
        date: attendanceDate,
        status,
        month,
        year,
        mealType
      });
    }

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Bulk mark attendance
export const bulkMarkAttendance = async (req, res) => {
  try {
    const { date, members, status } = req.body;
    
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const month = attendanceDate.getMonth() + 1;
    const year = attendanceDate.getFullYear();

    const attendanceRecords = [];
    
    const startOfDay = new Date(attendanceDate);
    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    for (const memberId of members) {
      const existing = await Attendance.findOne({
        member: memberId,
        date: { $gte: startOfDay, $lte: endOfDay }
      });

      if (existing) {
        existing.status = status;
        await existing.save();
        attendanceRecords.push(existing);
      } else {
        const newAttendance = await Attendance.create({
          member: memberId,
          date: attendanceDate,
          status,
          month,
          year
        });
        attendanceRecords.push(newAttendance);
      }
    }

    res.json({
      success: true,
      message: 'Bulk attendance marked successfully',
      data: attendanceRecords
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get attendance by member
export const getMemberAttendance = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { month, year } = req.query;

    const query = { member: memberId };
    
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const absentDays = attendance.filter(a => a.status === 'absent').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        attendance,
        stats: {
          totalDays,
          presentDays,
          absentDays,
          attendancePercentage
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get today's attendance
export const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      date: today
    }).populate('member', 'name phone foodTime');

    const allMembers = await Member.find({ isActive: true });
    const markedMemberIds = attendance.map(a => a.member._id.toString());
    
    const unmarkedMembers = allMembers.filter(
      m => !markedMemberIds.includes(m._id.toString())
    );

    res.json({
      success: true,
      data: {
        marked: attendance,
        unmarked: unmarkedMembers,
        totalPresent: attendance.filter(a => a.status === 'present').length,
        totalAbsent: attendance.filter(a => a.status === 'absent').length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance statistics
export const getAttendanceStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const monthlyAttendance = await Attendance.aggregate([
      {
        $match: {
          month: parseInt(month),
          year: parseInt(year)
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: monthlyAttendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
