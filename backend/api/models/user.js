'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      isEmail: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    rolid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    statusid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Userstatuses',
        key: 'id'
      }
    },
    userimageid: DataTypes.INTEGER,
    satimageid: DataTypes.INTEGER,
    policerecordimageid: DataTypes.INTEGER,
    criminalrecordimageid: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};