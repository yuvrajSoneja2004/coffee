import { auth } from "@/lib/sheetConfig";
import { google } from "googleapis";
import { NextResponse } from "next/server";

async function WriteToSpecificColumn(
  columnToWrite: string,
  values: any,
  colLength: number,
) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = `LIST AND OPTIONS!${columnToWrite}${colLength + 2}`; // Appending to the entire column B
  const valueInputOption = "USER_ENTERED";
  const resource = { values: values.map((value) => [value]) };

  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      requestBody: resource,
    });
    return res;
  } catch (error) {
    console.log(error, "writeToSheetError");
    throw error; // Ensure error is thrown to be caught by the POST function
  }
}
export async function POST(req: Request, res: Response) {
  try {
    const { name, currentUnit, listIndex, columnToWrite } = await req.json();
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
    const range = `LIST AND OPTIONS`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    // Length of the existing column items
    const columnsLen = response.data.values
      ?.slice(1)
      ?.map((subArray) => subArray[listIndex])
      .filter((item) => item !== "" && item !== undefined).length;

    console.log(
      response.data.values
        ?.slice(1)
        ?.map((subArray) => subArray[3])
        .filter((item) => item !== "" && item !== undefined),
    );

    // Checking if both name and currentUnit are passed in request body
    if (!name || !currentUnit || !listIndex) {
      return NextResponse.json({
        res: false,
        msg: "Invalid or missing input data",
      });
    }
    const writeRes = await WriteToSpecificColumn(
      columnToWrite,
      [`${name}[${currentUnit}]`],
      columnsLen as number,
    );

    return NextResponse.json({
      res: true,
      msg: "Values added successfully",
      data: writeRes,
    });
  } catch (error) {
    return NextResponse.json({
      res: false,
      msg: `Error ${error}`,
    });
  }
}
