const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Movie = require("./models/Movie");
const User = require("./models/User");

// Connect to DB
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,{});
    console.log("MongoDB are Connected".cyan.underline.bold); 
  } catch (error) {
    console.log(error);
  }
};

// Read JSON files
const movies = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/movies.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB
const importData = async () => {
    try {
      await Movie.create(movies);
      await User.create(users);
      console.log('Data Imported...'.green.inverse);
      process.exit();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete data
const deleteData = async () => {
    try {
      await Movie.deleteMany();
      await User.deleteMany();
      console.log('Data Destroyed...'.red.inverse);
      process.exit();
    } catch (err) {
      console.error(err);
    }
  };

  if (process.argv[2] === '-i') {
    importData();
  } else if (process.argv[2] === '-d') {
    deleteData();
  }
  