'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shippingstatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Shippingstatus.init({
    name: DataTypes.STRING(10),
    description: DataTypes.STRING(100),
    categoryid: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Shippingstatuscategories',
          key: 'id'
        }
      },
  }, {
    sequelize,
    modelName: 'Shippingstatus',
  });
  return Shippingstatus;
};