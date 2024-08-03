// index.js
const db = require("./models");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;


const userRoutes = require("./routes/user");
const actionRoutes = require("./routes/action");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, welcome to the Sex Actions App API!");
});


app.use("/users", userRoutes);
app.use("/actions", actionRoutes);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
