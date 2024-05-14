import { NextResponse } from "next/server";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile:
    "C:/Users/Yash/Desktop/dashboard-proto/free-nextjs-admin-dashboard/src/lib/google.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function WriteToSheet(values) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = "Sheet1!A1";
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

  try {
    const res = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    return res;
  } catch (error) {
    console.log(error, "writeToSheetError");
  }
}

export async function readSheet() {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = "Sheet1!A1:Z";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    return rows;
  } catch (error) {
    console.log("Error while reading the sheet data");
  }
}

export async function GET() {
  try {
    const dat = await readSheet();
    console.log(dat);
    return NextResponse.json(dat);
  } catch (error) {
    console.log(error);
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const write = await WriteToSheet([
      ["Name", "Age", "Location"],
      ["Yash", "12", "Koraput"],
    ]);
    console.log(write);
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ hi: "World" });
}
