// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("online", "offline"),
      defaultValue: "offline",
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complaints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    suspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  return User;
};
