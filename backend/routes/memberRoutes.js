import express from 'express';
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMemberStats
} from '../controllers/memberController.js';

const router = express.Router();

router.get('/', getAllMembers);
router.get('/stats', getMemberStats);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
