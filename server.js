// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const path = require("path");

const db = require("./models");
const authRoutes = require("./routes/auth");
const actionRoutes = require("./routes/action");
const requestRoutes = require("./routes/request");
const messageRoutes = require("./routes/message");
const blockRoutes = require("./routes/block");
const complaintRoutes = require("./routes/complaint");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const userController = require("./controllers/userController");
const { authenticateToken } = require("./middleware/authenticate"); // Your authentication middleware

require("dotenv").config(); // Load environment variables from .env file

app.use(express.json());

const allowedOrigins = ["http://localhost:8080", "http://127.0.0.1:8080"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  })
);

const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);

app.use(authenticateToken);
// Apply the middleware to update user status to online
app.use(userController.setOnlineStatus);

app.use("/actions", actionRoutes);
app.use("/requests", requestRoutes);
app.use("/messages", messageRoutes);
app.use("/blocks", blockRoutes);
app.use("/complaints", complaintRoutes);
app.use("/user", userRoutes);
app.use("/profile", profileRoutes);

process.env.TZ = "Asia/Kathmandu";


const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log("Server is running on port 3000");
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle user joining a room
  socket.on("join", async (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);

    // Update user status to online
    try {
      const user = await db.User.findByPk(userId);
      if (user) {
        user.status = "online";
        user.lastActiveAt = new Date(); // Update to current time
        await user.save();
      }
    } catch (error) {
      console.error("Error updating user status:", error.message);
    }
  });

  // Handle user disconnecting
  socket.on("disconnect", async () => {
    console.log("user disconnected");

    // Update user status to offline
    try {
      const socketId = socket.id;
      // Find the user based on socketId (if you are using a mapping of socketId to userId)
      const userId = null; /* logic to get userId from socketId */

      const user = await db.User.findByPk(userId);
      if (user) {
        user.status = "offline";
        user.lastActiveAt = new Date(); // Update to current time
        await user.save();
      }
    } catch (error) {
      console.error("Error updating user status:", error.message);
    }
  });

  // Listen for chat messages
  socket.on("sendMessage", async (messageData) => {
    // Broadcast the message to the recipient
    io.to(messageData.recipientId).emit("receiveMessage", messageData);

    // Save the message to the database
    try {
      await db.Message.create(messageData);
    } catch (error) {
      console.error("Error saving message:", error.message);
    }
  });

  socket.on("createRequest", (requestData) => {
    io.to(requestData.recipientId).emit("receiveRequest", requestData);
  });
});
