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
    // Fetch existing inventory data
    const getExisting = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    // Extract index of baseItem and current quantity value
    const index =
      (getExisting.data.values
        ?.slice(1)
        ?.map((subArray) => subArray[2])
        .findIndex((val) => val === baseItem) as number) + 1;

    if (index === 0) {
      // If baseItem not found in inventory
      return "ITEM_NOT_FOUND_ON_INVENTORY";
    }

    const value = parseInt(getExisting.data.values[index][4]);

    // Check inventory availability for IN and OUT operations
    if (qtyType === "in") {
      // IN operation: Check if there's enough material
      if (value + qty > 100) {
        // Change value from 0 to 100
        return "NOT_ENOUGH_MATERIALS";
      }
      await updateCellValue(value + qty, index);
    } else if (qtyType === "out") {
      // OUT operation: Check if there's enough quantity to take out
      if (value - qty < 0) {
        return "NOT_ENOUGH_QTY";
      }
      await updateCellValue(value - qty, index);
    } else {
      throw new Error("Invalid qtyType provided");
    }

    // Successfully updated inventory
    return "SUCCESS";
  } catch (error) {
    console.error(error, "Error in WriteToSheet");
    throw error; // Propagate the error back to caller
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
