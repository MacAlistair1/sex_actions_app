// routes/request.js
const express = require("express");
const { createRequest, updateRequestStatus } = require("../controllers/requestController");
const router = express.Router();
const { authenticateToken } = require("../middleware/authenticate");

router.post("/", authenticateToken, createRequest);
router.put("/:id", authenticateToken, updateRequestStatus);

module.exports = router;
