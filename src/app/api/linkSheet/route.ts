import { NextResponse } from "next/server";
import { google, sheets_v4 } from "googleapis";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/sheetConfig";
import User from "@/models/user";
import { connectToDB } from "../validateUser/route";

// const SECRET_KEY = process.env.SECRET_KEY as string; // Replace with your secret key from environment variables
const SECRET_KEY = "gayjagan69"; // Replace with your secret key from environment variables

connectToDB();
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sheetId = url.searchParams.get("sheetId")?.toString();
  console.log(sheetId);

  if (!sheetId) {
    return NextResponse.json({
      res: false,
      msg: "Sheet ID is required",
    });
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    if (response.status === 200) {
      return NextResponse.json({ res: true });
    } else {
      return NextResponse.json({ res: false, msg: "Sheet not found" });
    }
  } catch (error) {
    return NextResponse.json({
      res: false,
      msg: "Error accessing the sheet",
    });
  }
}

export async function POST(req: Request) {
  const { name, password, sheetId } = await req.json();
  console.log(sheetId);
  connectToDB();

  if (!sheetId) {
    return NextResponse.json({
      res: false,
      msg: "Sheet ID is required",
    });
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response: sheets_v4.Schema$Spreadsheet =
      await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      });

    if (response.status !== 200) {
      return NextResponse.json({ res: false, msg: "Sheet not found" });
    }

    // Step 1: Fetch all fields ids (subsheet IDs) [PASS]
    const sheetMetadata = response.data.sheets;
    const subsheetsIds: { [key: string]: number } = {};
    sheetMetadata?.forEach((sheet) => {
      if (sheet.properties?.title && sheet.properties.sheetId) {
        subsheetsIds[sheet.properties.title] = sheet.properties.sheetId;
      }
    });
    console.log("why", subsheetsIds);

    // Step 2: Store info in DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      role: "Admin", // Assuming 'user' role, adjust as needed
      sheetId,
      subsheetsIds,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("Success DB save");

    // Step 3: JWT Authentication
    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name, role: newUser.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    return NextResponse.json({ res: true, token });
    // return NextResponse.json({ res: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      res: false,
      msg: "Error processing the request",
    });
  }
}
