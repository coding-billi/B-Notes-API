const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/database1?directConnection=true";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = connectToMongo;
