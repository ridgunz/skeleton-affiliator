module.exports = (sequelize, Sequelize) => {
  const Otp = sequelize.define('otp_verification_affs', {
    phone: {
      type: Sequelize.STRING,
    },
    otp: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    time: {
      type: Sequelize.INTEGER,
    },
    is_process: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.STRING,
    },
  });
  return Otp;
}