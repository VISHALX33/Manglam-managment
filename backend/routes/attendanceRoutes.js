import express from 'express';
import {
  getMonthlyAttendance,
  markAttendance,
  bulkMarkAttendance,
  getMemberAttendance,
  getTodayAttendance,
  getAttendanceStats
} from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/monthly', getMonthlyAttendance);
router.get('/today', getTodayAttendance);
router.get('/stats', getAttendanceStats);
router.get('/member/:memberId', getMemberAttendance);
router.post('/mark', markAttendance);
router.post('/bulk-mark', bulkMarkAttendance);

export default router;
