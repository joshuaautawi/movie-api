const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,{});
    console.log("MongoDB are Connected".cyan.underline.bold); // cyan.underline.bold  => memberikan warna cyan pada tulisan "MongoDB are Connected" terminal
  } catch (error) {
    console.log(error);
  }
};

// ===================GAGAL CONNECT & Delete if nescesary============================
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   const conn = await mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   });

//   console.log(`MongoDB Connected: ${conn.connect.host}`);
// };

// module.exports = connectDB;
// ===================GAGAL CONNECT==========================


