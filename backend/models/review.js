'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
      Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Review.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
    }
  }

  Review.init(
    {
      bookingId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      serviceId: { type: DataTypes.INTEGER, allowNull: false },
      rating: { type: DataTypes.INTEGER },
      comment: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );

  return Review;
};
