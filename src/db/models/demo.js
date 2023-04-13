"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class demo extends Model {
    static associate(models) {
      // define association here
    }
  }
  demo.init(
    {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      email : DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "demo",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );
  return demo;
};
