// controllers/blockController.js
const db = require("../models");

exports.createBlock = async (req, res) => {
  try {
    const block = await db.Block.create({
      userId: req.user.id,
      blockedUserId: req.body.blockedUserId,
    });
    res.status(201).json(block);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlocks = async (req, res) => {
  try {
    const blocks = await db.Block.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(blocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
