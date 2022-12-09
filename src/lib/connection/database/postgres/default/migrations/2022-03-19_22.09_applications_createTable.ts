export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('applications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: 'VARCHAR(255)',
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      logo: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      activeFrom: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      orderFrom: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 999
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      informationMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      engine: 'InnoDB',
      charset: 'utf-8'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('applications');
  }
}