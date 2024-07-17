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

export async function GET(req: Request, res: Response) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const url = new URL(req.url);
    const sheetName = url.searchParams.get("sheetName")?.toString();
    const spreadSheetId = url.searchParams.get("spreadSheetId")?.toString();
    console.log("KYU", spreadSheetId);
    if (sheetName === undefined || spreadSheetId === undefined)
      return NextResponse.json({
        res: false,
        msg: "Provide sheetName and spreadsheetId from client",
      });

    const sheetRes = await readSheet(
      sheetName,
      spreadSheetId,
      session.accessToken as string,
    );
    // return NextResponse.json(true);
    return NextResponse.json(sheetRes);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      res: false,
      msg: error,
    });
  }
}
export const dynamic = "force-dynamic";