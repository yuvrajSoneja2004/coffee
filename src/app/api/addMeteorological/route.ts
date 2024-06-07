import { auth } from "@/lib/sheetConfig";
import { google } from "googleapis";
import { NextResponse } from "next/server";

async function WriteToSheet(values: any) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
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
    const {
      date,
      rainfall,
      humidityMin,
      humidityMax,
      temperatureMin,
      temperatureMax,
    } = await req.json();

    const write = await WriteToSheet([
      [
        date,
        rainfall,
        humidityMin,
        humidityMax,
        temperatureMin,
        temperatureMax,
      ],
    ]);
    return NextResponse.json({
      res: true,
      msg: "Successfully posted data",
    });
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ hi: "World" });
}
