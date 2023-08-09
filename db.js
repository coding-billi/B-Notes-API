const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/database1?directConnection=true";
const username = encodeURIComponent("fazlehadiazmat6g");
const password = encodeURIComponent("#assassin809F.H!");
const dbName = "B-Notes"; // Replace with your actual database name

const connectionString = `mongodb+srv://fazlehadiazmat6g:${password}@cluster0.pobwb0n.mongodb.net/${dbName}?retryWrites=true&w=majority`;
// const encodedStringForRef = ('mongodb+srv://fazlehadiazmat6g:%23assassin809F.H!@cluster0.pobwb0n.mongodb.net/your-database-name?retryWrites=true&w=majority');

const connectToMongo = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = connectToMongo;
