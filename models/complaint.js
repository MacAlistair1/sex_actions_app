// models/complaint.js
module.exports = (sequelize, DataTypes) => {
  const Complaint = sequelize.define("Complaint", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    complainedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Complaint;
};
