// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.js");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.js")(sequelize, DataTypes);
db.Action = require("./action.js")(sequelize, DataTypes);
db.Request = require("./request.js")(sequelize, DataTypes);
db.Message = require("./message.js")(sequelize, DataTypes);
db.Block = require("./block.js")(sequelize, DataTypes);
db.Complaint = require("./complaint.js")(sequelize, DataTypes);

module.exports = db;
