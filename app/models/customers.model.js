module.exports = (sequelize, Sequelize) => {
  const Customers = sequelize.define('customers', {
    phone: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone_status: {
      type: Sequelize.STRING,
    },
    member_type: {
      type: Sequelize.STRING,
    },
    is_gepd: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    register_via: {
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