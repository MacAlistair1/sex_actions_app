// app.js
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const authRoutes = require("./routes/auth");
const actionRoutes = require("./routes/action");
const requestRoutes = require("./routes/request");
const messageRoutes = require("./routes/message");
const blockRoutes = require("./routes/block");
const complaintRoutes = require("./routes/complaint");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/actions", actionRoutes);
app.use("/requests", requestRoutes);
app.use("/messages", messageRoutes);
app.use("/blocks", blockRoutes);
app.use("/complaints", complaintRoutes);
app.use("/users", userRoutes);
app.use("/profile", profileRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port 3000");
  });
});
