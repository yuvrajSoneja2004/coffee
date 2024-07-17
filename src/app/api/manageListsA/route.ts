import { auth } from "@/lib/sheetConfig";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

async function getGoogleSheetsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth });
}
// const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";

export async function readSheet(spreadsheetId: string, accessToken: string) {
  const sheets = await getGoogleSheetsClient(accessToken);
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
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const url = new URL(req.url);
    const spreadSheetId = url.searchParams.get("spreadSheetId")?.toString();
    if (spreadSheetId === undefined) {
      return NextResponse.json({ error: "Spreadsheet Id is not defined" });
    }
    const sheetRes = await readSheet(
      spreadSheetId,
      session.accessToken as string,
    );
    return NextResponse.json(sheetRes);
  } catch (error) {
    return NextResponse.json({
      res: false,
      msg: `Error ${error}`,
    });
  }
}
