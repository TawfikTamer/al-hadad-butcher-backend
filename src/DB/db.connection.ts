import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("Database Connected");
  } catch (error) {
    console.log(`error in DB connection`);
  }
};
