// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
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
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "others"),
        allowNull: true,
      },
      interestedGender: {
        type: DataTypes.ENUM("male", "female", "all"),
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
      },
      facebookId: {
        type: DataTypes.STRING,
        unique: true,
      },
      appleId: {
        type: DataTypes.STRING,
        unique: true,
      },
      lastActiveAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return User;
};
