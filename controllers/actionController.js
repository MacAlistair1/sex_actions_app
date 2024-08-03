// controllers/actionController.js
const db = require("../models");

exports.createAction = async (req, res) => {
  try {
    const action = await db.Action.create(req.body);
    res.status(201).json(action);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActions = async (req, res) => {
  try {
    const actions = await db.Action.findAll();
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
