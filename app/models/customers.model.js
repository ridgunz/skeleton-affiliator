module.exports = (sequelize, Sequelize) => {
  const Customers = sequelize.define('customers', {
    phone: {
      type: Sequelize.STRING,
    },
    createdAt: {
      field: 'created_at',
      type: Sequelize.DATE,
    },
    updatedAt: {
      field: 'updated_at',
      type: Sequelize.DATE,
    },
  });
  return Customers;
}