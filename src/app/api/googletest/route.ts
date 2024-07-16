import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

async function getGoogleSheetsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth });
}
// const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";


// ? WORKS
async function writeToSheet(values: any, accessToken: string , spreadsheetId: string) {
  const sheets = await getGoogleSheetsClient(accessToken);
  const range = "DAILY WORK DATA";
  const valueInputOption = "USER_ENTERED";

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
// const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";

// ? WORKS
async function readSheet(sheetName: string, accessToken: string,  spreadsheetId: string) {
  const sheets = await getGoogleSheetsClient(accessToken);
  const range = `${sheetName || "Sheet1"}!A1:Z`;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return "EMPTY";
    }

    return rows;
  } catch (error) {
    console.log("Error while reading the sheet data", error);
  }
}

async function deleteRow(
  sheetName: string,
  rowIndex: number,
  accessToken: string,
  spreadsheetId: string,
  subSheetId: string
) {
  
  const sheets = await getGoogleSheetsClient(accessToken);
  const requestBody = {
    requests: [
      {
        deleteDimension: {
          range: {
            sheetId: subSheetId,
            dimension: "ROWS",
            startIndex: rowIndex - 1,
            endIndex: rowIndex,
          },
        },
      },
    ],
  };

  try {
    console.log(subSheetId)
    const res = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody,
    });
    return res;
  } catch (error) {
    console.error("Error deleting row:", error);
    // throw error;
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const sheetName = url.searchParams.get("sheetName")?.toString();
    const spreadSheetId = url.searchParams.get("spreadSheetId")?.toString();

    if (!sheetName) {
      return NextResponse.json({
        res: false,
        msg: "Provide sheetName from client",
      });
    }
    console.log(sheetName)

    const sheetRes = await readSheet(sheetName, session.accessToken as string , spreadSheetId);
    return NextResponse.json(sheetRes);
  } catch (error) {
    console.log(error);
    console.log("da error", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const {
      slNo,
      date,
      material,
      singleDetailOfWork,
      treeListValue,
      maleLabourCount,
      femaleLabourCount,
      block,
      rowFrom,
      rowTo,
      treeCount,
      spreadSheetId
    } = await req.json();

    console.log("galliyan" , spreadSheetId)

    const write = await writeToSheet(
      [
        [
          slNo,
          date,
          material,
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
      session.accessToken as string,
      spreadSheetId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { sheetName, rowIndex ,spreadSheetId, subSheetId } = await req.json();
    await deleteRow(sheetName, rowIndex, session.accessToken as string , spreadSheetId, subSheetId);
    console.log("Row deleted successfully.");
    return NextResponse.json({ success: false });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
