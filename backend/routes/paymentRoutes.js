import express from 'express';
import {
  getAllPayments,
  createPayment,
  getMemberPayments,
  getPaymentStats,
  getPendingPayments,
  deletePayment
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', getAllPayments);
router.get('/stats', getPaymentStats);
router.get('/pending', getPendingPayments);
router.get('/member/:memberId', getMemberPayments);
router.post('/', createPayment);
router.delete('/:id', deletePayment);

export default router;
