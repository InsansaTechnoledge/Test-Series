import mongoose from "mongoose";

let connOne = null;
let connTwo = null;

const connectDB = async () => {
  let connOneError = null;
  let connTwoError = null;

  // Connect to MONGODB1 (connOne)
  try {
    connOne = mongoose.createConnection(process.env.MONGODB1_URL);
    console.log("✅ connOne (MONGODB1) connected");

  } catch (err) {

    connOneError = err;
    console.error("❌ connOne (MONGODB1) failed:", err.message);
  }

  // Connect to MONGODB2 (connTwo)
  try {
    connTwo =  mongoose.createConnection(process.env.MONGODB2_URL);
    console.log("✅ connTwo (MONGODB2) connected");

  } catch (err) {

    connTwoError = err;
    console.error("❌ connTwo (MONGODB2) failed:", err.message);
  }

  // Final check
  if (!connOne && !connTwo) {
    throw new Error("🚫 Failed to connect to both MongoDB instances");
  }
};

export default connectDB;
export { connOne, connTwo };
