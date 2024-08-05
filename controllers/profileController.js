// controllers/profileController.js
const db = require("../models");
const fs = require("fs");
const path = require("path");

exports.updateProfile = async (req, res) => {
  const { username, age, interestedGender } = req.body;

  try {
    const user = await db.User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file) {
      // Remove the old profile picture if it exists
      if (user.profilePicture) {
        fs.unlinkSync(path.join(__dirname, "../uploads", user.profilePicture));
      }
      user.profilePicture = req.file.filename;
    }

    user.username = username || user.username;
    user.age = age || user.age;
    user.interestedGender = interestedGender || user.interestedGender;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.User.findByPk(id, {
      attributes: [
        "username",
        "email",
        "gender",
        "age",
        "interestedGender",
        "status",
        "profilePicture",
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Construct the full URL for the profile picture
    if (user.profilePicture) {
      user.profilePicture = `${req.protocol}://${req.get("host")}/uploads/${
        user.profilePicture
      }`;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
