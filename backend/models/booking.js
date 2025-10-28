'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Each booking belongs to a single service
      Booking.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
      // Each booking belongs to a user
      Booking.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      // Each booking belongs to an address
      Booking.belongsTo(models.Address, { foreignKey: 'addressId', as: 'address' });
      Booking.hasOne(models.Review, { foreignKey: 'bookingId', as: 'review' });
      Booking.belongsTo(models.User, { foreignKey: 'helperId', as: 'helper' });

    }
  }

  Booking.init(
    {
      userId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
      addressId: DataTypes.INTEGER,
      helperId: DataTypes.INTEGER,
      status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    },
    {
      sequelize,
      modelName: 'Booking',
    }
  );
  return Booking;
};
