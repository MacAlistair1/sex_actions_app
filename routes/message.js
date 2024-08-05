// routes/message.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authenticate");
const messageController = require("../controllers/messageController");
const multer = require("multer");
const path = require("path");

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

// Define routes
router.post(
  "/send",
  authenticateToken,
  upload.single("media"),
  messageController.sendMessage
);
router.get("/:recipientId", authenticateToken, messageController.getMessages);

module.exports = router;
