// routes/action.js
const express = require("express");
const router = express.Router();
const db = require("../models");
const { authenticateToken } = require("../middleware/authenticate");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const action = await db.Action.create(req.body);
    res.status(201).json(action);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const actions = await db.Action.findAll();
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
