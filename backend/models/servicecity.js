'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceCity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  ServiceCity.init({
    serviceId: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ServiceCity',
  });
  return ServiceCity;
};