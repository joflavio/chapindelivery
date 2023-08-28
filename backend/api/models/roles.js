'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Roles.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull:false
    },
    description: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'Roles',
  });
  return Roles;
};