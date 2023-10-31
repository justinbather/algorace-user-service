const mongoose = require("mongoose");
require("dotenv").config();

const db = process.env.MONGO_URI;
console.log(db);

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(db);

    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
