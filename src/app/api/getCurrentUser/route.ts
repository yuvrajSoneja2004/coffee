import User from "@/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId")?.toString();
    if (userId === undefined)
      return NextResponse.json({
        res: false,
        msg: "Provide userId from client",
      });

    console.log("userid from client" ,userId);
    // const currentUser = await User.findById(userId);
    const currentUser = await User.findOne({ _id: userId });
    console.log('currentUser', currentUser);
    console.log("After");
    // Remove password field
    currentUser.password = "";
    return NextResponse.json(currentUser);
  } catch (error) {
    return NextResponse.json({
      res: false,
      msg: error,
    });
  }
}
