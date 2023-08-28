'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  City.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    stateid: {
        type: DataTypes.INTEGER,
        //allowNull: false,
        references: {
          model: 'States',
          key: 'id'
        }
      },
  }, {
    sequelize,
    modelName: 'City',
  });
  return City;
};