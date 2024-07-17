import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import { auth } from "@/lib/sheetConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

async function getGoogleSheetsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth });
}
// const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";

async function WriteToSheet(
  values: any,
  accessToken: string,
  spreadsheetId: string,
) {
  const sheets = await getGoogleSheetsClient(accessToken);
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

export async function readSheet(
  sheetName: string,
  accessToken: string,
  spreadsheetId: string,
) {
  const sheets = await getGoogleSheetsClient(accessToken);
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

export async function deleteRow(
  sheetName: string,
  rowIndex: number,
  accessToken: string,
  spreadsheetId: string,
) {
  const sheets = await getGoogleSheetsClient(accessToken);
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
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const sheetName = url.searchParams.get("sheetName")?.toString();
    const spreadSheetId = url.searchParams.get("spreadSheetId")?.toString();

    if (spreadSheetId === undefined || sheetName === undefined)
      return NextResponse.json({
        res: false,
        msg: "Provide spreadSheetId and sheetName from client",
      });

    const sheetRes = await readSheet(
      sheetName,
      session.accessToken as string,
      spreadSheetId,
    );
    return NextResponse.json(sheetRes);
  } catch (error) {
    console.log(error);
  }
}

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const { slNo, date, expense, amount, remarks, spreadSheetId } =
      await req.json();

    await WriteToSheet(
      [[slNo, date, expense, amount, remarks]],
      session.accessToken as string,
      spreadSheetId,
    );
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ hi: "World" });
}

export async function PUT(req: Request, res: Response) {
  try {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.accessToken) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 },
        );
      }
      const { sheetName, rowIndex, spreadSheetId } = await req.json(); // Assuming the request contains sheetName and rowIndex to delete
      await deleteRow(
        sheetName,
        rowIndex,
        session.accessToken as string,
        spreadSheetId,
      );
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
