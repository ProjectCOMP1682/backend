module.exports = {
  up: (queryInterface, Sequelize) => new Promise((resolve, reject) => {
    {
      queryInterface.addConstraint('Cvs', {
        type: 'foreign key',
        fields: ['postId'],
        name: 'FK_Cvs_Posts',
        references: {
          table: 'Posts',
          field: 'id',
        },
        onUpdate: "CASCADE",
      })
      queryInterface.addConstraint('Cvs', {
        type: 'foreign key',
        fields: ['userId'],
        name: 'FK_Cvs_Users',
        references: {
          table: 'Users',
          field: 'id',
        },
        onUpdate: "CASCADE",
      })
      queryInterface.addConstraint('Posts', {
        type: 'foreign key',
        fields: ['userId'],
        name: 'FK_Posts_Users',
        references: {
          table: 'Users',
          field: 'id',
        },
        onUpdate: "CASCADE",
      })
      queryInterface.addConstraint('Posts', {
        type: 'foreign key',
        fields: ['detailPostId'],
        name: 'FK_Posts_DetailPosts',
        references: {
          table: 'DetailPosts',
          field: 'id',
        },
        onUpdate: "CASCADE",
      })
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
      queryInterface.removeConstraint('Posts', 'FK_Posts_Users')
      queryInterface.removeConstraint('Posts','FK_Posts_DetailPosts')
      queryInterface.removeConstraint('Cvs', 'FK_Cvs_Posts')
      queryInterface.removeConstraint('Cvs', 'FK_Cvs_Users')

    }
  })
}
