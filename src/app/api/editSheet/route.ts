import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/lib/sheetConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

interface UpdateParams {}
async function getGoogleSheetsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth });
}
async function UpdateToSheet(
  values: any,
  sheetName: string,
  rowIndex: number,
  spreadsheetId: string,
  subSheetId: string,
  accessToken: string,
) {
  // TODO: Fix update sheet not working.
  const sheets = await getGoogleSheetsClient(accessToken);
  // const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = `${sheetName}!${rowIndex + 2}:${rowIndex + 2}`;
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

  try {
    const res = await sheets.spreadsheets.values.update({
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
export async function PUT(req: Request, res: Response) {
  try {
    const {
      slNo,
      date,
      typeOfWork,
      singleDetailOfWork,
      treeListValue,
      maleLabourCount,
      femaleLabourCount,
      block,
      rowFrom,
      rowTo,
      treeCount,
      rowIndex,
      sheetName,
      spreadSheetId,
      subSheetId,
    } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await UpdateToSheet(
      [
        [
          slNo,
          date,
          typeOfWork,
          singleDetailOfWork,
          treeListValue,
          maleLabourCount,
          femaleLabourCount,
          block,
          rowFrom,
          rowTo,
          treeCount,
        ],
      ],
      sheetName,
      rowIndex,
      spreadSheetId,
      subSheetId,
      session.accessToken as string,
    );
    return NextResponse.json({
      res: true,
      msg: "Updated successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      res: false,
      msg: error,
    });
  }
}
