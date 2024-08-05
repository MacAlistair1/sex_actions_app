// routes/user.js
const express = require("express");
const {
  updateUserStatus,
  getUserStatus,
  getOnlineUserList,
} = require("../controllers/userController");
const router = express.Router();
const { authenticateToken } = require("../middleware/authenticate");

router.put("/status", authenticateToken, updateUserStatus);
router.get("/status/:id", authenticateToken, getUserStatus);
router.get("/online-users", authenticateToken, getOnlineUserList);

module.exports = router;
