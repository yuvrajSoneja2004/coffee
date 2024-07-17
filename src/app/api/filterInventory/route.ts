import { google, sheets_v4 } from "googleapis";
import { NextResponse } from "next/server";
import { auth } from "@/lib/sheetConfig";

// TODO: Continue from here.
// const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
export async function readSheet(spreadsheetId: string): Promise<string[][] | "EMPTY"> {
  const sheets = google.sheets({ version: "v4", auth });
  const range = `INVENTORY!A1:Z`;

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
    return "EMPTY";
  }
}

interface FilterParams {
  material: string;
  unit: string;
  spreadSheetId: string;
}

async function filterInventory(
  material: string,
  unit: string,
  spreadSheetId:string
): Promise<string[][]> {
  try {
    const rows = await readSheet(spreadSheetId);
    if (rows === "EMPTY") {
      return [];
    }

    const header = rows[0];

    const materialIndex = header.indexOf("Material");
    const unitIndex = header.indexOf("Unit");

    const filteredRows = rows.slice(1).filter((row) => {
      const materialMatch = material ? row[materialIndex] === material : true;
      const unitMatch = unit ? row[unitIndex] === unit : true;
      return materialMatch && unitMatch;
    });

    return filteredRows;
  } catch (error) {
    console.log("Error while filtering the sheet data", error);
    return [];
  }
}

export async function POST(req: Request, res: Response): Promise<NextResponse> {
  try {
    const { material, unit , spreadSheetId }: FilterParams = await req.json();
    const filterRes = await filterInventory(material, unit , spreadSheetId);
    return NextResponse.json(filterRes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred while filtering data." },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
