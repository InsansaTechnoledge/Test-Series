import mongoose from "mongoose";

let connOne = null
let connTwo = null 

const connectDB = async () => {
  try {
     connOne = await mongoose.createConnection(process.env.MONGODB1_URL)
     connTwo = await mongoose.createConnection(process.env.MONGODB2_URL);

    console.log("✅ Connected to both MongoDB instances");


  } catch (err) {
    console.error("❌ Error connecting to MongoDB", err);
    throw err;
  }
};

export default connectDB;

export {connOne , connTwo}