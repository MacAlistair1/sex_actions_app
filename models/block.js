// models/block.js
module.exports = (sequelize, DataTypes) => {
    const Block = sequelize.define('Block', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      blockedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    return Block;
  };
  