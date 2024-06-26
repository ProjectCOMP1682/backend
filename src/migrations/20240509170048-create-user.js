'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      generId: {
        type: Sequelize.STRING
      },
      phonenumber: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.BLOB('long')
      },
      dob: {
        type: Sequelize.STRING
      },
      isActiveEmail: {
        type: Sequelize.BOOLEAN
      },
      roleId: {
        type: Sequelize.STRING
      },
      statusId: {
        type: Sequelize.STRING
      },
      usertoken: {
        type: Sequelize.STRING
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};