'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shippings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Shippings.init({
    shippingimageid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Files',
        key: 'id'
      }
    },
    requestdate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    requestaddress: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    requestcityid: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
          model: 'Cities',
          key: 'id'
        }
    },
    requestuserid: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    requestrating: DataTypes.INTEGER,
    requestcomments: DataTypes.STRING(255),

    destinationaddress: {
        type: DataTypes.STRING(255),
        allowNull:false
    },
    destinationcityid: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
          model: 'Cities',
          key: 'id'
        }
    },
    acceptancedate: DataTypes.DATE,
    receiveddate: DataTypes.DATE,
    receivedimageid: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Files',
          key: 'id'
        }
    },
    deliveryuserid:  {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
    },
    deliveryrating: DataTypes.INTEGER,
    delivercomments: DataTypes.STRING(255),
    delivereddate: DataTypes.DATE,
    deliveredimageid:{
        type: DataTypes.INTEGER,
        references: {
          model: 'Files',
          key: 'id'
        }
    },
    statusid: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
          model: 'Shippingstatuses',
          key: 'id'
        }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull:false
    },
    canceldate: DataTypes.DATE,
    cancelcomments: DataTypes.STRING(255),

    billingdocumentimageid:{
        type: DataTypes.INTEGER,
        references: {
          model: 'Files',
          key: 'id'
        }

    },

  }, {
    sequelize,
    modelName: 'Shippings',
  });
  return Shippings;
};