import { auth } from "@/lib/sheetConfig";
import { google } from "googleapis";
import { NextResponse } from "next/server";

async function updateCellValue(valueToUpdate: number, cellPosition: number) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = `INVENTORY!E${cellPosition + 1}`;
  const valueInputOption = "USER_ENTERED";
  const resource = {
    values: [[valueToUpdate]],
  };
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    return response;
  } catch (error) {
    console.error(error, "Error writing to sheet");
  }
}
async function WriteToSheet(
  values: any,
  baseItem: string,
  qty: number,
  qtyType: string,
) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = "INVENTORY";
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

  try {
    const getExisting = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const index =
      (getExisting.data.values
        ?.slice(1)
        ?.map((subArray) => subArray[2])
        .filter((item) => item !== "")
        .findIndex((val) => val === baseItem) as number) + 1;
    const value = getExisting.data.values
      ?.slice(1)
      ?.map((subArray) => subArray[4])
      .filter((item) => item !== "")[index - 1];

    console.log("beat", index, parseInt(value) - qty);

    if (index - 1 !== -1) {
      if (parseInt(value) - qty < 0) {
        return "NOT_ENOUGH_QTY";
      }

      if (qtyType === "out") {
        await updateCellValue(parseInt(value) - qty, index);
      } else {
        await updateCellValue(parseInt(value) + qty, index);
      }
    } else {
      return "ITEM_NOT_FOUND_ON_INVENTORY";
    }
  } catch (error) {
    console.log(error, "deleteFromInventory");
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const { date, material, baseMaterial, currentItemUnit, qtyType, qty } =
      await req.json();
    const write = await WriteToSheet(
      [[date, material, baseMaterial, currentItemUnit, qty]],
      baseMaterial,
      parseInt(qty),
      qtyType,
    );

    if (write === "ITEM_NOT_FOUND_ON_INVENTORY") {
      // Means there's no stock
      return NextResponse.json({
        res: false,
        msg: "ITEM_NOT_FOUND_ON_INVENTORY",
      });
    }

    if (write === "NOT_ENOUGH_QTY") {
      // Means there's no stock
      return NextResponse.json({
        res: false,
        msg: "NOT_ENOUGH_QTY",
      });
    }
    return NextResponse.json({
      res: true,
      msg: "Successfully deleted data in inventory",
    });
  } catch (error) {
    return NextResponse.json(
      {
        res: false,
        msg: "Error from deleteFromInventory route (server)",
      },
      { status: 500 },
    );
  }
}
