const dbConfig = require('../config/database');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAlias: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// define semua models yang ada pada aplikasi
db.books = require('./book.model')(sequelize, Sequelize);
db.otps = require('./otp.model')(sequelize, Sequelize);
db.customers = require('./customers.model')(sequelize, Sequelize);
module.exports = db;