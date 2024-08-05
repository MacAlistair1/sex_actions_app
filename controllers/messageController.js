// controllers/messageController.js
const db = require("../models");
const { Op } = require("sequelize");
const path = require("path");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

exports.sendMessage = async (req, res) => {
  const { recipientId, messageType, message } = req.body;
  const senderId = req.user.id;
  let mediaUrl = null;

  try {
    if (messageType === "photo" || messageType === "video") {
      // Handle media uploads
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      mediaUrl = `${req.protocol}://${req.get("host")}/uploads/${
        file.filename
      }`;
    }

    const messageRecord = await db.Message.create({
      senderId,
      recipientId,
      message,
      messageType,
      mediaUrl,
    });

    // Emit the message to the recipient via socket.io
    req.io.to(recipientId).emit("receiveMessage", messageRecord);

    res.status(201).json(messageRecord);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { recipientId } = req.params;
  const senderId = req.user.id;

  try {
    const messages = await db.Message.findAll({
      where: {
        [Op.or]: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
