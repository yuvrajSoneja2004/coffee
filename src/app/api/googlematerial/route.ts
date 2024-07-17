import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/lib/sheetConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
async function getGoogleSheetsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth });
}
async function WriteToSheet(
  values,
  spreadsheetId: string,
  accessToken: string,
) {
  const sheets = await getGoogleSheetsClient(accessToken);
  const range = "MATERIAL";
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
    console.log(error, "writeToSheetError");
  }
}

export async function readSheet(
  sheetName: string,
  spreadsheetId: string,
  accessToken: string,
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
  spreadsheetId: string,
  accessToken: string,
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

export async function POST(req: Request, res: Response) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const {
      slNo,
      date,
      boughtIssuedBy,
      baseMaterial,
      singleUnit,
      inQty,
      outQty,
      remarks,
      spreadSheetId,
    } = await req.json();

    await WriteToSheet(
      [
        [
          slNo,
          date,
          boughtIssuedBy,
          baseMaterial,
          singleUnit,
          inQty,
          outQty,
          remarks,
        ],
      ],
      spreadSheetId,
      session.accessToken as string,
    );
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ hi: "World" });
}

export async function PUT(req: Request, res: Response) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    try {
      const { sheetName, rowIndex, spreadSheetId } = await req.json(); // Assuming the request contains sheetName and rowIndex to delete
      await deleteRow(
        sheetName,
        rowIndex,
        spreadSheetId,
        session.accessToken as string,
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
