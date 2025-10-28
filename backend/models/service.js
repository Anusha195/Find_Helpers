'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Service.hasMany(models.Booking, { foreignKey: 'serviceId', as: 'bookings' });
      Service.hasMany(models.Review, { foreignKey: 'serviceId', as: 'reviews' });
      

    }
  }
  Service.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    active: DataTypes.BOOLEAN,
    providerId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};