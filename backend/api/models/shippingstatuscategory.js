'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shippingstatuscategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Shippingstatuscategory.init({
    name: DataTypes.STRING(10),
    description: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'Shippingstatuscategory',
  });
  return Shippingstatuscategory;
};