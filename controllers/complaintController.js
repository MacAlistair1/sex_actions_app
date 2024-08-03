// controllers/complaintController.js
const db = require("../models");

exports.createComplaint = async (req, res) => {
  try {
    const complaint = await db.Complaint.create({
      userId: req.user.id,
      complainedUserId: req.body.complainedUserId,
      reason: req.body.reason,
    });

    const user = await db.User.findByPk(req.body.complainedUserId);
    user.complaints += 1;
    if (user.complaints >= 3) {
      user.suspended = true;
    }
    await user.save();

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await db.Complaint.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
