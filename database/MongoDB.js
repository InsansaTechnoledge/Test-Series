import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connOne = await mongoose.createConnection(process.env.MONGODB1_URL)
    const connTwo = await mongoose.createConnection(process.env.MONGODB2_URL);

    console.log("✅ Connected to both MongoDB instances");

    return { connOne, connTwo };

  } catch (err) {
    console.error("❌ Error connecting to MongoDB", err);
    throw err;
  }
};

export default connectDB;
