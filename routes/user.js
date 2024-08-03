// routes/user.js
const express = require("express");
const router = express.Router();
const db = require("../models");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const user = await db.User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
