// models/action.js
module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define("Action", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intensity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Action;
};
