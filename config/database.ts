import mongoose from  "mongoose";
// do co async nen de void se loi can phai them promise
export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect Success!");
  } catch (error) {
    console.log("Connect Error!");
  }
}