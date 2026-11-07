import "dotenv/config";

import mongoose from "mongoose";
import bcrypt from "bcrypt";

import connectDB from "../config/db.js";
import User from "../models/userModel.js";

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;

    // Check whether admin details are configured
    if (!name || !email || !password) {
      throw new Error("Please configure ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD");
    }

    if (password.length < 8) {
      throw new Error("Admin password must contain at least 8 characters");
    }

    await connectDB();

    

    // Check whether an admin already exists
    const existingAdmins = await User.find({ role: "admin" });

    if (existingAdmins.length > 0) {
      const sameAdmin = existingAdmins.find(
        (admin) => admin.email === email
      );

      if (sameAdmin) {
        console.log("Admin account already exists.");
        return;
      }

      throw new Error("An admin account already exists with another email.");
    }

    // Check whether this email is already registered as a normal user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "This email is already registered as a normal user. Use a different admin email."
      );
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the admin account
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin account created successfully.");
    console.log(`Admin email: ${admin.email}`);

  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();