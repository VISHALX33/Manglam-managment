import Member from '../models/Member.js';
import Payment from '../models/Payment.js';
import ActivityLog from '../models/ActivityLog.js';

// Get all members
export const getAllMembers = async (req, res) => {
  try {
    const { search, paymentPlan, isActive } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (paymentPlan) {
      query.paymentPlan = paymentPlan;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const members = await Member.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single member
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new member
export const createMember = async (req, res) => {
  try {
    const { name, phone, foodTime, paymentPlan, planAmount, joiningDate, address, emergencyContact, initialPayment } = req.body;

    // Check if phone already exists
    const existingMember = await Member.findOne({ phone });
    if (existingMember) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number already registered' 
      });
    }

    const member = await Member.create({
      name,
      phone,
      foodTime,
      paymentPlan,
      planAmount,
      joiningDate: joiningDate || new Date(),
      address,
      emergencyContact
    });

    // Log activity
    await ActivityLog.create({
      action: 'CREATE',
      entity: 'member',
      entityId: member._id,
      description: `New member added: ${name}`
    });

    // Create initial payment if provided
    if (initialPayment && initialPayment.amount > 0) {
      const currentDate = new Date();
      await Payment.create({
        member: member._id,
        amount: initialPayment.amount,
        paymentDate: currentDate,
        paymentMethod: initialPayment.paymentMethod || 'cash',
        transactionId: initialPayment.transactionId || '',
        notes: initialPayment.notes || 'Initial payment at registration',
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });

      // Log payment activity
      await ActivityLog.create({
        action: 'CREATE',
        entity: 'payment',
        entityId: member._id,
        description: `Initial payment of ₹${initialPayment.amount} received from ${name}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update member
export const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }

    // Log activity
    await ActivityLog.create({
      action: 'UPDATE',
      entity: 'member',
      entityId: member._id,
      description: `Member updated: ${member.name}`
    });

    res.json({
      success: true,
      message: 'Member updated successfully',
      data: member
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete member
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }

    // Log activity
    await ActivityLog.create({
      action: 'DELETE',
      entity: 'member',
      entityId: member._id,
      description: `Member deleted: ${member.name}`
    });

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get member statistics
export const getMemberStats = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ isActive: true });
    const inactiveMembers = await Member.countDocuments({ isActive: false });

    const foodTimeDistribution = await Member.aggregate([
      { $group: { _id: '$foodTime', count: { $sum: 1 } } }
    ]);

    const paymentPlanDistribution = await Member.aggregate([
      { $group: { _id: '$paymentPlan', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        foodTimeDistribution,
        paymentPlanDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
