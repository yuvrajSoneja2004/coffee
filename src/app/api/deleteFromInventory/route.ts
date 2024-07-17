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

// Define types for parsed values and inventory items
interface ParsedValue {
  baseItem: string;
  qty: number;
}

interface InventoryItem {
  qty: number;
  rowIndex: number;
}

// const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
export async function handleInventoryChanges(
  solutionName: string,
  ltrValue: number,
  spreadsheetId: string,
  accessToken: string,
): Promise<string | void> {
  const sheets = await getGoogleSheetsClient(accessToken);

  // Elements Composition Sheet
  const elementsRange = "ELEMENTS COMPOSITION!A1:Z";
  const inventoryRange = "INVENTORY!A1:Z";

  try {
    // Fetch Elements Composition Sheet
    const elementsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: elementsRange,
    });
    const rows = elementsResponse.data.values;

    if (!rows || rows.length === 0) {
      return "EMPTY";
    }

    // Find the column index for the given solutionName
    const headers = rows[0];
    const columnIndex = headers.findIndex((header) => header === solutionName);

    if (columnIndex === -1) {
      // console.log(`Column ${solutionName} not found`);
      return;
    }

    // Extract and parse the values from the column
    const columnValues = rows
      .slice(1)
      .map((row) => row[columnIndex])
      .filter((value) => value !== "");

    const parsedValues: ParsedValue[] = columnValues
      .map((value) => {
        const match = value.match(/([^\[]+)\[(\d+)\]/);
        if (match) {
          return { baseItem: match[1].trim(), qty: parseInt(match[2], 10) };
        }
        return null;
      })
      .filter((item): item is ParsedValue => item !== null);

    // console.log(parsedValues);

    // Fetch Inventory Sheet
    const inventoryResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: inventoryRange,
    });
    const inventoryRows = inventoryResponse.data.values;

    if (!inventoryRows || inventoryRows.length === 0) {
      return "INVENTORY_EMPTY";
    }

    const inventoryHeaders = inventoryRows[0];
    const baseItemIndex = inventoryHeaders.findIndex(
      (header) => header === "BaseItem",
    );
    const qtyIndex = inventoryHeaders.findIndex((header) => header === "QTY");

    if (baseItemIndex === -1 || qtyIndex === -1) {
      // console.log(`BaseItem or QTY column not found in INVENTORY sheet`);
      return;
    }

    // Create a map of inventory items for quick lookup
    const inventoryMap = new Map<string, InventoryItem>();
    for (let i = 1; i < inventoryRows.length; i++) {
      const row = inventoryRows[i];
      inventoryMap.set(row[baseItemIndex], {
        qty: parseInt(row[qtyIndex], 10),
        rowIndex: i,
      });
    }

    // Check for sufficient materials and presence of all base items
    for (const { baseItem, qty } of parsedValues) {
      const adjustedQty = qty * ltrValue;
      if (!inventoryMap.has(baseItem)) {
        // console.log(`BaseItem ${baseItem} not found in INVENTORY sheet`);
        return "BASEITEM_NOT_FOUND";
      }
      const inventoryItem = inventoryMap.get(baseItem)!;
      if (inventoryItem.qty < adjustedQty) {
        // console.log(`Insufficient materials for ${baseItem}`);
        return "INSUFFICIENT_MATERIALS";
      }
    }

    // Deduct the values
    parsedValues.forEach(({ baseItem, qty }) => {
      const adjustedQty = qty * ltrValue;
      const inventoryItem = inventoryMap.get(baseItem)!;
      inventoryItem.qty -= adjustedQty;
      inventoryMap.set(baseItem, inventoryItem);
    });

    // Prepare the updated values to write back to the QTY column in the sheet
    const updateRequests: Promise<sheets_v4.Schema$UpdateValuesResponse>[] = [];
    inventoryMap.forEach((value, key) => {
      updateRequests.push(
        sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `INVENTORY!${String.fromCharCode(65 + qtyIndex)}${value.rowIndex + 1}`, // Update QTY column
          valueInputOption: "USER_ENTERED",
          resource: { values: [[value.qty]] },
        }),
      );
    });

    await Promise.all(updateRequests);

    return "SUCCESS";
  } catch (error) {
    console.log("Error while reading the sheet data", error);
    throw error;
  }
}

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const {
      date,
      material,
      baseMaterial,
      currentItemUnit,
      qtyType,
      qty,
      spreadSheetId,
    } = await req.json();

    if (material === "Solutions") {
      const moduleRes = await handleInventoryChanges(
        baseMaterial,
        parseInt(qty),
        spreadSheetId,
        session.accessToken as string,
      );
      console.log(moduleRes);

      return NextResponse.json({
        res: moduleRes !== "SUCCESS" ? false : true,
        msg: moduleRes,
      });
    }
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



// -----------------------------------------------------------------------------------------------------

// ! Origninal Function (DO NOT REMOVE)
// async function WriteToSheet(
//   values: any,
//   baseItem: string,
//   qty: number,
//   qtyType: string,
// ) {
//   const sheets = google.sheets({ version: "v4", auth });
//   const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
//   const range = "INVENTORY";
//   const valueInputOption = "USER_ENTERED";
//   const resource = { values };

//   try {
//     // Fetch existing inventory data
//     const getExisting = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//     });

//     console.log(getExisting , 'this')

//     // Extract index of baseItem and current quantity value
//     const index =
//       (getExisting.data.values
//         ?.slice(1)
//         ?.map((subArray) => subArray[2])
//         .findIndex((val) => val === baseItem) as number) + 1;

//     if (index === 0) {
//       // If baseItem not found in inventory
//       return "ITEM_NOT_FOUND_ON_INVENTORY";
//     }

//     const value = parseInt(getExisting.data.values[index][4]);

//     // Check inventory availability for IN and OUT operations
//     if (qtyType === "in") {
//       // IN operation: Check if there's enough material
//       if (value + qty > 100) {
//         // Change value from 0 to 100
//         return "NOT_ENOUGH_MATERIALS";
//       }
//       await updateCellValue(value + qty, index);
//     } else if (qtyType === "out") {
//       // OUT operation: Check if there's enough quantity to take out
//       if (value - qty < 0) {
//         return "NOT_ENOUGH_QTY";
//       }
//       await updateCellValue(value - qty, index);
//     } else {
//       throw new Error("Invalid qtyType provided");
//     }

//     // Successfully updated inventory
//     return "SUCCESS";
//   } catch (error) {
//     console.error(error, "Error in WriteToSheet");
//     throw error; // Propagate the error back to caller
//   }
// }


// ? Original 
// export async function POST(req: Request, res: Response) {
//   try {
//     const { date, material, baseMaterial, currentItemUnit, qtyType, qty } =
//       await req.json();
//     const write = await WriteToSheet(
//       [[date, material, baseMaterial, currentItemUnit, qty]],
//       baseMaterial,
//       parseInt(qty),
//       qtyType,
//     );

//     if (write === "ITEM_NOT_FOUND_ON_INVENTORY") {
//       // Means there's no stock
//       return NextResponse.json({
//         res: false,
//         msg: "ITEM_NOT_FOUND_ON_INVENTORY",
//       });
//     }

//     if (write === "NOT_ENOUGH_QTY") {
//       // Means there's no stock
//       return NextResponse.json({
//         res: false,
//         msg: "NOT_ENOUGH_QTY",
//       });
//     }
//     return NextResponse.json({
//       res: true,
//       msg: "Successfully deleted data in inventory",
//     });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         res: false,
//         msg: "Error from deleteFromInventory route (server)",
//       },
//       { status: 500 },
//     );
//   }
// }


// ? Original
// async function updateCellValue(valueToUpdate: number, cellPosition: number) {
//   const sheets = google.sheets({ version: "v4", auth });
//   const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
//   const range = `INVENTORY!E${cellPosition + 1}`;
//   const valueInputOption = "USER_ENTERED";
//   const resource = {
//     values: [[valueToUpdate]],
//   };
//   try {
//     const response = await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range,
//       valueInputOption,
//       resource,
//     });
//     return response;
//   } catch (error) {
//     console.error(error, "Error writing to sheet");
//   }
// }
