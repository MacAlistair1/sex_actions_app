// controllers/requestController.js
const db = require("../models");
const { Op } = require("sequelize");

exports.createRequest = async (req, res) => {
  const { recipientId, actionId } = req.body;
  const senderId = req.user.id;

  try {
    const existingRequest = await db.Request.findOne({
      where: {
        senderId,
        recipientId,
        [Op.or]: [{ status: "pending" }, { status: "accepted" }],
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        error: "You have already sent a request to this user.",
      });
    }
  } catch (error) {}

  try {
    const existingRequests = await db.Request.findOne({
      where: {
        senderId,
        recipientId,
        status: "declined",
        lastDeclinedAt: {
          [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingRequests) {
      return res.status(400).json({
        error:
          "You cannot send a request to this user for 24 hours after being declined three times.",
      });
    }

    const request = await db.Request.create({
      senderId,
      recipientId,
      actionId,
    });

    // Emit the message to the recipient via socket.io
    req.io.to(recipientId).emit("receiveRequest", {
      senderId: senderId,
      recipientId: recipientId,
      status: "request",
      message: "",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await db.Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (status === "declined") {
      const declinesCount = request.declinesCount + 1;
      const lastDeclinedAt = new Date();

      await request.update({
        status,
        declinesCount,
        lastDeclinedAt,
      });

      if (declinesCount >= 3) {
        // Add logic to prevent further requests for 24 hours
        await db.Request.update(
          { lastDeclinedAt },
          {
            where: {
              senderId: request.senderId,
              recipientId: request.recipientId,
              status: "declined",
            },
          }
        );

        req.io.to(request.senderId).emit("receiveRequest", {
          senderId: request.senderId,
          recipientId: request.recipientId,
          status: "declined",
          message: "You can send request to this person after 24 hours.",
        });
      } else {
        req.io.to(request.senderId).emit("receiveRequest", {
          senderId: request.senderId,
          recipientId: request.recipientId,
          status: "declined",
          message: "",
        });
      }
    } else {
      await request.update({ status });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to delete requests older than 3 hours
const deleteOldRequests = async () => {
  try {
    const threeHoursAgo = new Date(new Date() - 3 * 60 * 60 * 1000);

    await db.Request.destroy({
      where: {
        createdAt: {
          [Op.lt]: threeHoursAgo,
        },
      },
    });

    console.log("Old requests deleted");
  } catch (error) {
    console.error("Error deleting old requests:", error.message);
  }
};

// Set an interval to delete old requests every hour
setInterval(deleteOldRequests, 60 * 60 * 1000); // Run every hour
