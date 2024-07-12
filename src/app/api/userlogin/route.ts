import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import { connectToDB } from "../validateUser/route";

// const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";
const SECRET_KEY = "gayjagan69";

export async function POST(req: Request) {
  try {
    const { name, password } = await req.json();
    connectToDB();
    console.log(name, password);

    if (!name || !password) {
      return NextResponse.json({
        res: false,
        msg: "Name and password are required",
      });
    }

    const user = await User.findOne({ name });
    if (!user) {
      return NextResponse.json({
        res: false,
        msg: "User not found",
      });
    }
    console.log(user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        res: false,
        msg: "Invalid password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    console.log("Success login");

    return NextResponse.json({
      res: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      res: false,
      msg: "Error processing the request",
    });
  }
}
