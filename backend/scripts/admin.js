const bcrypt = require('bcrypt');
const { User } = require('../models'); // adjust the path to your models folder

(async () => {
  try {
    const password = "Admin@123"; // the password you want
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      passwordHash: hashedPassword,
      phone: "0000000000",
      role: "admin",
    });

    console.log("Admin created:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
})();
