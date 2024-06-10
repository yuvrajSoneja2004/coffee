import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import { auth } from "@/lib/sheetConfig";

async function WriteToSheet(values: any) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = "CASH";
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      requestBody: {
        values,
      },
    });
    return res;
  } catch (error) {
    console.log(error, "saveToCashSheetError");
  }
}

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

export async function deleteRow(sheetName: string, rowIndex: number) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = `${sheetName}!${rowIndex}:${rowIndex}`;

  try {
    const res = await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
    return res;
  } catch (error) {
    console.error("Error deleting row:", error);
    throw error;
  }
}

export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const sheetName = url.searchParams.get("sheetName")?.toString();
    if (sheetName === undefined)
      return NextResponse.json({
        res: false,
        msg: "Provide sheetName from client",
      });
    const sheetRes = await readSheet(sheetName);
    return NextResponse.json(sheetRes);
  } catch (error) {
    console.log(error);
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const { slNo, date, expense, amount, remarks } = await req.json();

    const write = await WriteToSheet([[slNo, date, expense, amount, remarks]]);
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ hi: "World" });
}

export async function PUT(req: Request, res: Response) {
  try {
    try {
      const { sheetName, rowIndex } = await req.json(); // Assuming the request contains sheetName and rowIndex to delete
      await deleteRow(sheetName, rowIndex);
      console.log("Row deleted successfully.");
      return NextResponse.json({ success: true });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ success: false });
    }
  } catch (error) {
    console.log(error);
  }
}
