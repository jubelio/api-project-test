export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('applications', [
      {
        name: 'App1',
        description: 'Aplikasi Pertama',
        logo: 'logo1.png',
        url: 'https://test1.com',
        orderFrom: 1,
        isActive: true
      },
      {
        name: 'App2',
        description: 'Aplikasi Kedua',
        logo: 'logo2.png',
        url: 'https://test2.com',
        orderFrom: 2,
        isActive: false
      }
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('applications', null, {});
}
}