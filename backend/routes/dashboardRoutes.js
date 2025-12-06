import express from 'express';
import { getDashboardStats, getActivityLogs } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/activities', getActivityLogs);

export default router;
