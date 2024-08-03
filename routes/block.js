// routes/block.js
const express = require("express");
const router = express.Router();
const db = require("../models");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const block = await db.Block.create({
      userId: req.user.id,
      blockedUserId: req.body.blockedUserId,
    });
    res.status(201).json(block);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const blocks = await db.Block.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(blocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
