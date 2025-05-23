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
async function WriteToSpecificColumn(
  sheetName: string,
  columnToWrite: string,
  values: any,
  colLength: number,
  spreadsheetId: string,
  accessToken: string,
) {
  const sheets = await getGoogleSheetsClient(accessToken);
  const range = `${sheetName}!${columnToWrite}${colLength + 2}`; // Appending to the entire column B
  // const range = `LIST AND OPTIONS!${columnToWrite}${colLength + 2}`; // Appending to the entire column B
  const valueInputOption = "USER_ENTERED";
  const resource = { values: values.map((value: any) => [value]) };

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
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const {
      sheetName,
      name,
      currentUnit,
      listIndex,
      columnToWrite,
      spreadSheetId,
    } = await req.json();
    const sheets = await getGoogleSheetsClient(session.accessToken);

    // const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
    const range = `${sheetName}`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadSheetId,
      range,
    });
    // Length of the existing column items
    const columnsLen = response.data.values
      ?.slice(1)
      ?.map((subArray) => subArray[listIndex])
      .filter((item) => item !== "" && item !== undefined).length;

    // Checking if both name and currentUnit are passed in request body
    if (!name || !currentUnit || !listIndex) {
      return NextResponse.json({
        res: false,
        msg: "Invalid or missing input data",
      });
    }
    const writeRes = await WriteToSpecificColumn(
      sheetName,
      columnToWrite,
      [`${name}[${currentUnit}]`],
      columnsLen as number,
      spreadSheetId,
      session.accessToken as string,
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
