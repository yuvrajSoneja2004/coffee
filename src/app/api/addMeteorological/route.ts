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
async function WriteToSheet(
  values: any,
  spreadsheetId: string,
  accessToken: string,
) {
  const sheets = await getGoogleSheetsClient(accessToken);
  const range = "METEOROLOGICAL";
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

export async function POST(req: Request, res: Response) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const {
      date,
      rainfall,
      humidityMin,
      humidityMax,
      temperatureMin,
      temperatureMax,
      spreadSheetId,
    } = await req.json();

    await WriteToSheet(
      [
        [
          date,
          rainfall,
          humidityMin,
          humidityMax,
          temperatureMin,
          temperatureMax,
        ],
      ],
      spreadSheetId,
      session.accessToken as string,
    );
    return NextResponse.json({
      res: true,
      msg: "Successfully posted data",
    });
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ hi: "World" });
}
