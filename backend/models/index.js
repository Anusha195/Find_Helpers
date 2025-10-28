'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load all models
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Run associate for all models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

/** === Associations === **/

// User → Service (one-to-many)
if (db.User && db.Service) {
  db.User.hasMany(db.Service, { foreignKey: 'providerId', as: 'services' });
  db.Service.belongsTo(db.User, { foreignKey: 'providerId', as: 'provider' });
}

// Category → Service (one-to-many)
if (db.Category && db.Service) {
  db.Category.hasMany(db.Service, { foreignKey: 'categoryId', as: 'services' });
  db.Service.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });
}

// Service ↔ City (many-to-many through ServiceCity)
if (db.Service && db.City && db.ServiceCity) {
  db.Service.belongsToMany(db.City, {
    through: db.ServiceCity,
    as: 'cities',      // alias for Service → City
    foreignKey: 'serviceId',
    otherKey: 'cityId',
  });

  db.City.belongsToMany(db.Service, {
    through: db.ServiceCity,
    as: 'services',    // alias for City → Service
    foreignKey: 'cityId',
    otherKey: 'serviceId',
  });
}

console.log("Models loaded:", Object.keys(db));
console.log("Associations:");
console.log(db.Service.associations);


module.exports = db;
