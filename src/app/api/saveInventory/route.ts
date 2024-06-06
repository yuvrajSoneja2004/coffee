import { auth } from "@/lib/sheetConfig";
import { google } from "googleapis";
import { NextResponse } from "next/server";

async function WriteToSheet(values) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = "INVENTORY";
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
    console.log(error, "addToInventoryError");
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const { date, material, baseItem, currentItemUnit, qty } = await req.json();
    console.log(material, baseItem, qty);
    const write = await WriteToSheet([
      [date, material, baseItem, currentItemUnit, qty],
    ]);
    return NextResponse.json({
      res: true,
      msg: "Successfully added data in inventory",
    });
  } catch (error) {
    return NextResponse.json(
      {
        res: false,
        msg: "Error from saveInventory route (server)",
      },
      { status: 500 },
    );
  }
}
