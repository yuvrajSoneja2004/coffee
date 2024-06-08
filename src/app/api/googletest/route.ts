import { NextResponse } from "next/server";
import { google } from "googleapis";
// import l from "../../google.json"
import path from "path";
import { auth } from "@/lib/sheetConfig";

// const auth = new google.auth.GoogleAuth({

//     credentials: {
//           type: "service_account",
//           project_id: "coffee-423310",
//           private_key_id: "8d490853f94a82d0271c24ec394dc6f8a24f6f5b",
//           private_key:
//             "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC59Hmnehwr6sOL\n9QxbHJJaUwxDVwQuqWbN75OfnUrmXdDgbvmfNcBTIKtzbtYnUqLAv0UGj30dEn+o\ntBVnIyN7L2HP+D9CdVL4isxgWtIwBVySEWMhquuWfAUqwK37VNJxcvF3x3nqfV2p\ns0766uMVQ1JOD9rPyiZt9B1FL/4CqzdmVbXIZK/cFqY6GVvc/W9gTiK9dg1lkExC\nv8A9KveZ1a2zlCCOLGpXxRzi1uybVfD9XtFgkKnYvzfNE2xAK0jwYRclkmw8rZyg\nBPIuCG0FuoEjPJsSQa0ltn7p0uQv0HnifIOm/oiJgscS5ywUdouSzDPsSRdKubME\nLEpuD9hhAgMBAAECgf9EXAdZkklr26EHWQyT2QlODTzxhHEG0OyEBAf8t6yW//at\nPmEoi45fDhmILFmbByFIn6DFYzziupi7wMsaHYX8liBt/ubsCtGifCS2a9gA4zbd\nKIcpMWtZOEGxVjEdoyab0J0510snJkWF4t5CPnDVXpIt+7AWAt78f30KoMN/bDna\n4xmaKAmiUeASDpGn0PJnRxhzezcuIez/cs0nSIud5lYGQE0/1bWdMGfB2yXMeeKh\ncoJ4BRjHUvAvr5qr+0UwU+ewDDhZ0avdYK0YJEwKnFvI2XrxDJNteAYmxz9BKnpI\nluP+s+0QLXXh+LAKs1e87yQgq82deWF5a2M4wmECgYEA/tPbtq4+XvdvmeHw31z9\n5aRFCYPuWzqi08mn8nT45Ez6sK5Hg6+hmYyNMZNYC/TvvYe3eJFF41sAVvmCzGWO\nh9qpMVQYBabkqPtMO0jkdfyMO6uqh0hSa3ZXintRIj4oNvG9gd/OWzYO2CrsghdF\nF6ukgeRpy8Af/ms4SOfg4tkCgYEAus9/S1Uew6Qt3hTC5NOqYqXbcNUda1+yNAZb\nK/hmHo7/C224Lj13aMmxW4heTKYUiSfyfskDAYGQhZDGu6wwR7IlebWyrkZ5dSp/\nLbBqPn/Uz9QyxJHucxC8NZnzHdRXrxLd1VGYE/Yi5f+oNne/aX1NirhQP5TnS6yO\nQApeHMkCgYEAzy0renBbYRZGc5OQI+kUuzk8r6nFhgI8E3flxWd4WxSC1FY86kFG\nXvI4cM/cS4xNxYerkKh7a4a21f9xagA/SxBpciNujFnNmd0Fc0WmCI7U7EZ7FBWm\nfJvwPDRaGD70rwcHDaoJuXpPw0vSkUmd8Mqpqrkrkm2XFV/SmON8oLECgYBWUU5W\nNqySZagz94/eP9d44X418qM3W+5xj4ZNGOfGsvgyBa6W3xvvtVJYIvi/nfXbMjQg\nVS0oYv+uV6kcSoG8fxpF1KkNUc8JTmuZZuyQmGxy42/Z2Dw/urncYpgtblJduO/7\ng0or3w1dDPZixI4TZiyQLn4WAu2kz8Si3qeB0QKBgQCRt+ku61DYRvz8pIvD+DZH\ngiR1s+vTLfSwVbpmqA/a67AxCYAbAicCuXKAvYY1Wl5Uw9RV2Wh25mgxdKwFn11Q\ntCz0E89L0IQ/unKcJOL/A/chSZIIyYptjF9o3o922rpNDDEl+Gvxc1A98hiwVF6f\nKT6vX95RQWtOeQXQvsHrdQ==\n-----END PRIVATE KEY-----\n",
//           client_email: "coffee@coffee-423310.iam.gserviceaccount.com",
//           universe_domain: "googleapis.com",
//         },
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],

// });



async function WriteToSheet(values: any) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = "DAILY WORK DATA";
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

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

export async function readSheet(sheetName: string) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = `${!sheetName ? "Sheet1" : sheetName}!A1:Z`;

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

export async function deleteRow(sheetName: string, rowIndex: number) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1yxSl2Q_yEa-C3IjJa4MguYHd9wmnlElnJ3aaUI3MWSM";
  const range = `${sheetName}!${rowIndex}:${rowIndex}`;

  try {
    const res = await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
    return res;
  } catch (error) {
    console.error("Error deleting row:", error);
    throw error;
  }
}

export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const sheetName = url.searchParams.get("sheetName")?.toString();
    if (sheetName === undefined)
      return NextResponse.json({
        res: false,
        msg: "Provide sheetName from client",
      });

    console.log(path.join(__dirname, "../../../lib/google.json"));
    const sheetRes = await readSheet(sheetName);
    return NextResponse.json(sheetRes);
  } catch (error) {
    console.log(error);
  }
}

export async function POST(req: Request, res: Response) {
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
    } = await req.json();

    const write = await WriteToSheet([
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
    ]);
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ hi: "World" });
}

export async function PUT(req: Request, res: Response) {
  try {
    try {
      const { sheetName, rowIndex } = await req.json(); // Assuming the request contains sheetName and rowIndex to delete
      await deleteRow(sheetName, rowIndex);
      console.log("Row deleted successfully.");
      return NextResponse.json({ success: true });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ success: false });
    }
  } catch (error) {
    console.log(error);
  }
}
