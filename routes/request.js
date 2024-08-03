// routes/request.js
const express = require("express");
const router = express.Router();
const db = require("../models");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const request = await db.Request.create({
      fromUserId: req.user.id,
      toUserId: req.body.toUserId,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const request = await db.Request.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (request.toUserId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    request.status = req.body.status;
    await request.save();
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
