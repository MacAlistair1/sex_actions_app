// routes/complaint.js
const express = require("express");
const router = express.Router();
const db = require("../models");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, async (req, res) => {
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
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const complaints = await db.Complaint.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
