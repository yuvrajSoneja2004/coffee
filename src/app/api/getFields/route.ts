import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import { auth } from "@/lib/sheetConfig";

export async function readSheet(sheetName: string) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = `${!sheetName ? "Sheet1" : sheetName}!A1:Z`;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;

    // Check if rows is empty
    if (!rows || rows.length === 0) {
      return "EMPTY";
    }

    return rows;
  } catch (error) {
    console.log("Error while reading the sheet data", error);
  }
}

export async function GET(req: Request, res: Response) {
  try {
    console.log("GOT HIT INVENTORY");
    const url = new URL(req.url);
    const sheetName = url.searchParams.get("sheetName")?.toString();
    if (sheetName === undefined)
      return NextResponse.json({
        res: false,
        msg: "Provide sheetName from client",
      });

    console.log(path.join(__dirname, "../../../lib/google.json"));
    const sheetRes = await readSheet(sheetName);
    return NextResponse.json(sheetRes);
  } catch (error) {
    console.log(error);
  }
}
