import mongoose from "mongoose";
import { NextResponse } from "next/server";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Use model function correctly
const User = mongoose.models.users || mongoose.model("users", userSchema);

export const connectToDB = () => {
  mongoose
    .connect(
      "mongodb+srv://yuvrajdev20004:fullstackdev69@cluster0.kyyjow2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    )
    .then((res) => {
      if (res) {
        console.log("Successfully connected to DB");
      }
    })
    .catch((err) => {
      console.log("Error connecting to DB", err);
    });
};

export async function POST(req: Request, res: Response) {
  connectToDB();
  try {
    const { name, password } = await req.json();
    console.log(name, password);
    const dbRes = await User.findOne({ name: name, password: password });
    console.log(dbRes);

    if (dbRes) {
      console.log(dbRes.role);
      return NextResponse.json({
        name: dbRes?.name,
        role: dbRes?.role,
        res: true,
      });
    }

    return NextResponse.json({
      res: false,
      msg: "User does'nt exists",
    });
  } catch (error) {
    console.log(error);
  }
}
