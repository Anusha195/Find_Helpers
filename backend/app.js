const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const categoryRoutes = require('./routes/category');
const bookingRoutes = require('./routes/booking');
const authRoutes = require('./routes/auth');
const categoryServices = require('./routes/categoryService');
const partnerRoutes = require('./routes/partner');
const addressRoutes = require('./routes/address');
const serviceRoutes = require("./routes/service");
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/partner', partnerRoutes);
app.use("/api", categoryServices);
app.use("/api/categories", categoryRoutes);
app.use('/api/addresses', addressRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", require("./routes/review"));
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
