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
// const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
async function WriteToSheet(
  values: any,
  baseItem: string,
  qty: number,
  spreadsheetId: string,
  accessToken: string,
) {
  const sheets = await getGoogleSheetsClient(accessToken);
  const range = "INVENTORY";
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

  try {
    const getExisting = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const index =
      getExisting.data.values
        ?.slice(1)
        ?.map((subArray) => subArray[2])
        .filter((item) => item !== "")
        .findIndex((val) => val === baseItem) + 1;
    const value = getExisting.data.values
      ?.slice(1)
      ?.map((subArray) => subArray[4])
      .filter((item) => item !== "")[index - 1];

    console.log("beat", index, parseInt(value) + qty);
    if (index - 1 !== -1) {
      await updateCellValue(parseInt(value) + qty, index);
      console.log("Well yeah");
    } else {
      const res = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        requestBody: {
          values,
        },
      });
      return res;
    }
  } catch (error) {
    console.log(error, "addToInventoryError");
  }
}

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const { date, material, baseItem, currentItemUnit, qty, spreadSheetId } =
      await req.json();
    await WriteToSheet(
      [[date, material, baseItem, currentItemUnit, qty]],
      baseItem,
      parseInt(qty),
      spreadSheetId,
      session.accessToken as string,
    );
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

