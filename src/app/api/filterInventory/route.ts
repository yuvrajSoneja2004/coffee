import { google } from "googleapis";
import { NextResponse } from "next/server";
import { auth } from "@/lib/sheetConfig";

export async function readSheet() {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = `INVENTORY!A1:Z`;

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
    const filterOption = new URL(req.url);
    const filterQueryStr = filterOption.searchParams
      .get("filterOption")
      ?.toString();

    console.log(filterQueryStr);
    if (filterQueryStr === undefined)
      return NextResponse.json({
        res: false,
        msg: "Provide filter option from client",
      });

    const filteredInventory = await readSheet();
    console.log(filteredInventory);

    return NextResponse.json({});
  } catch (error) {
    console.log(error);
  }
}
