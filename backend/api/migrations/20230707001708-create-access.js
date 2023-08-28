'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accesses', {
      roleid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
          key: 'id'
        },
      },
      featureid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Features',
          key: 'id'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.sequelize.query('ALTER TABLE Accesses ADD PRIMARY KEY (roleid, featureid);');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Accesses');
  }
};