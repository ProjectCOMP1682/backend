module.exports = {
  up: (queryInterface, Sequelize) => new Promise((resolve, reject) => {
    {
      queryInterface.addConstraint('Companies', {
        type: 'foreign key',
        fields: ['userId'],
        name: 'FK_Companies_Users',
        references: {
          table: 'Users',
          field: 'id',
        },
        onUpdate: "CASCADE",
      })
      queryInterface.addConstraint('Accounts', {
        type: 'foreign key',
        fields: ['userId'],
        name: 'FK_Accounts_Users',
        references: {
          table: 'Users',
          field: 'id',
        },
        onUpdate: "CASCADE",
      })
      queryInterface.addConstraint('Users', {
        type: 'foreign key',
        fields: ['companyId'],
        name: 'FK_Users_Companies',
        references: {
          table: 'Companies',
          field: 'id',
        },
        onUpdate: 'CASCADE'
      })

    }
  }),
  down: (queryInterface, Sequelize) => new Promise((resolve, reject) => {
    {
      queryInterface.removeConstraint('Companies', 'FK_Companies_Users')
      queryInterface.removeConstraint('Accounts', 'FK_Accounts_Users')
      queryInterface.removeConstraint('Users', 'FK_Users_Companies')


    }
  })
}
