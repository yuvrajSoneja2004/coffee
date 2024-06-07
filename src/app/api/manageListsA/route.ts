import { auth } from "@/lib/sheetConfig";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function readSheet() {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = `LIST AND OPTIONS A!A1:Z`;

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
export async function GET() {
  try {
    console.log("GOT MANAGE A");
    const sheetRes = await readSheet();
    return NextResponse.json(sheetRes);
  } catch (error) {
    return NextResponse.json({
      res: false,
      msg: `Error ${error}`,
    });
  }
}
