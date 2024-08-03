// app.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./models");
const authRoutes = require("./routes/auth");
const actionRoutes = require("./routes/action");
const requestRoutes = require("./routes/request");
const messageRoutes = require("./routes/message");
const blockRoutes = require("./routes/block");
const complaintRoutes = require("./routes/complaint");

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/actions", actionRoutes);
app.use("/requests", requestRoutes);
app.use("/messages", messageRoutes);
app.use("/blocks", blockRoutes);
app.use("/complaints", complaintRoutes);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});