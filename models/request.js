// models/request.js
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    "Request",
    {
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      actionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "declined"),
        defaultValue: "pending",
      },
      declinesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lastDeclinedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Request.associate = (models) => {
    Request.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
    Request.belongsTo(models.User, {
      as: "recipient",
      foreignKey: "recipientId",
    });
  };

  return Request;
};
