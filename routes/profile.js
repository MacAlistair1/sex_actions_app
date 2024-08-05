// routes/profile.js
const express = require('express');
const { updateProfile, getProfile } = require('../controllers/profileController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { authenticateToken } = require("../middleware/authenticate");

router.put('/update', authenticateToken, upload.single('profilePicture'), updateProfile);
router.get('/:id', authenticateToken, getProfile);

module.exports = router;
