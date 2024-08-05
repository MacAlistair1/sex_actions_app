// controllers/userController.js
const db = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");

// Update user status and lastActiveAt
exports.updateUserStatus = async (req, res, next) => {
  const { userId, status } = req.body;

  if (!["online", "offline"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.status = status;
    user.lastActiveAt = moment().toISOString(); // Use ISO string for accurate timestamp
    await user.save();

    res.status(200).json({ message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user status
exports.getUserStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.User.findByPk(id, {
      attributes: ["status"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ status: user.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware to update user status to online
exports.setOnlineStatus = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(); // Skip if user is not authenticated
  }

  const userId = req.user.id; // Assuming req.user contains the authenticated user

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.status = "online";
    user.lastActiveAt = new Date().toISOString();
    await user.save();

    console.log("User status updated successfully");
  } catch (error) {
    console.log("Error on user status update.", error);
  }

  next();
};

exports.getOnlineUserList = async (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID

  try {
    // Fetch all online users excluding the authenticated user and order by lastActiveAt
    const onlineUsers = await db.User.findAll({
      attributes: [
        "id",
        "username",
        "profilePicture",
        "status",
        "lastActiveAt",
      ], // Fetch required attributes
      where: {
        id: { [Op.ne]: userId }, // Exclude the authenticated user
        status: "online", // Only include users who are online
      },
      order: [["lastActiveAt", "DESC"]], // Order by lastActiveAt in descending order
    });

    // Fetch requests sent by the authenticated user
    const requestsSent = await db.Request.findAll({
      where: {
        senderId: userId,
        status: "pending", // Check for pending requests
      },
      attributes: ["recipientId"],
    });

    const sentRequests = new Set(
      requestsSent.map((request) => request.recipientId)
    );

    // Format the response
    const userList = onlineUsers.map((user) => ({
      id: user.id,
      name: user.username,
      picture: user.profilePicture,
      activeStatus: user.status === "online" ? "online" : "offline", // Assuming status holds "online" or "offline"
      requestSent: sentRequests.has(user.id),
    }));

    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to update the status of inactive users
const updateInactiveUserStatus = async () => {
  try {
    const fifteenMinutesAgo = moment().subtract(15, "minutes").toDate();

    // Update the status of users who were last active more than 15 minutes ago
    await db.User.update(
      { status: "offline" },
      {
        where: {
          lastActiveAt: {
            [Op.lt]: fifteenMinutesAgo,
          },
          status: "online",
        },
      }
    );

    console.log("Inactive users status updated to offline");
  } catch (error) {
    console.error("Error updating user status:", error.message);
  }
};

// Set an interval to update inactive users' status every minute
setInterval(updateInactiveUserStatus, 60 * 1000); // Run every minute
