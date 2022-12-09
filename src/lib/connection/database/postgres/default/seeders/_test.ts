export default {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [{
            username: 'tester',
            password: 'tester'
            }], {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    }
  }