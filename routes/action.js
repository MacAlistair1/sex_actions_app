// routes/action.js
const express = require("express");
const router = express.Router();
const db = require("../models");

// Create a new action
router.post("/", async (req, res) => {
  try {
    const action = await db.Action.create(req.body);
    res.status(201).json(action);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
