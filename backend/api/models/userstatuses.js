'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Userstatuses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Userstatuses.init({
    name: DataTypes.STRING(10),
    description: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'Userstatuses',
  });
  return Userstatuses;
};