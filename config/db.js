const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectDb = async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Mongodb connected");
};

module.exports = connectDb;
