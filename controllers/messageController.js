// controllers/messageController.js
const db = require("../models");

exports.createMessage = async (req, res) => {
  try {
    const message = await db.Message.create({
      senderId: req.user.id,
      receiverId: req.body.receiverId,
      content: req.body.content,
      type: req.body.type,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await db.Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId: req.user.id, receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.user.id },
        ],
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
