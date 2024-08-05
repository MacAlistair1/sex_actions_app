// models/message.js
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      messageType: {
        type: DataTypes.ENUM("text", "voice", "photo", "video"),
        default: "text"
      },
      mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
    Message.belongsTo(models.User, {
      as: "recipient",
      foreignKey: "recipientId",
    });
  };

  return Message;
};
