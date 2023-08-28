'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  File.init({
    originalfilename: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    path: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    uploaddatetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    
    filetypeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Filetypes',
        key: 'id'
      }
    },
    
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Filestatuses',
        key: 'id'
      }
    },
    
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};