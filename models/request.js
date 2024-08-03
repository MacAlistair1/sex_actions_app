// models/request.js
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define("Request", {
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  return Request;
};
