import User from "@/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import path from "path";

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
    // ../../../lib/google.json
    console.log(__dirname);
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
