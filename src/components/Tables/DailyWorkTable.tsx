"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import Loader from "../common/Loader";
import NoInfoFound from "../NoInfoFound/NoInfoFound";
import Delete from "../Actions/Delete";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  handleReload,
  handleSlNo,
  handleSlNoMaterial,
} from "@/redux/features/authSlice";
import Edit from "../Actions/DailyMaterialData/Edit";
import { formatDate } from "@/lib/formatDate";

interface DailyWorkTableProps {
  sheetName: string;
}

interface CategorizedData {
  [date: string]: string[][];
}

function DailyWorkTable({ sheetName }: DailyWorkTableProps) {
  const [categorizedData, setCategorizedData] = useState<CategorizedData>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { name, role, reloadHandler } = useAppSelector(
    (state) => state.authSlice,
  );
  const dispatch = useDispatch();

  // function formatDate(date: Date) {
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year
  //   return `${day}.${month}.${year}`;
  // }
  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/googletest?sheetName=${sheetName}`,
      );
      console.log(data);

      const [headerRow, ...dataRows] = data;
      setHeaders(headerRow);

      // Group data by dates
      const categorized: CategorizedData = {};
      dataRows.forEach((row: string[]) => {
        const date = row[1];
        if (!categorized[date]) {
          categorized[date] = [];
        }
        categorized[date].push(row);
      });

      setCategorizedData(categorized);

      if ((sheetName = "Daily Work Data")) {
        // const lastEntryDate = "03.07.24";
        const lastEntryDate = dataRows[dataRows.length - 1][1];
        const lastEntrySl = dataRows[dataRows.length - 1][0];
        console.log("Pyaar", lastEntrySl);
        const todayDate = formatDate();
        // const todayDate = formatDate(new Date());
        // const todayDate = formatDate(new Date("2024-07-06"));
        console.log("Aaj", todayDate);

        if (lastEntryDate !== todayDate) {
          dispatch(handleSlNo({ no: parseInt(lastEntrySl) }));
        } else {
          // dispatch(handleSlNo({ no: parseInt(lastEntrySl) }));
        }
      }

      if (sheetName === "MATERIAL") {
        console.log("Material", data?.length);
        dispatch(handleSlNoMaterial({ no: data?.length }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [reloadHandler]);

  if (isLoading) return <Loader additionalStyles="mt-5" />;
  if (Object.keys(categorizedData).length === 0) return <NoInfoFound />;

  return (
    <Table className="border-stroke px-7.5 dark:border-strokedark dark:bg-boxdark mt-6 rounded-md border bg-white py-6 shadow-default">
      <TableCaption>A list of all the recorded data.</TableCaption>
      <TableHeader>
        <TableRow className="text-sm">
          {/* Render table headings */}
          {headers.map((heading, index) => {
            return (
              <TableHead className="text-[14px] font-bold" key={index}>
                {heading}
              </TableHead>
            );
          })}
          {sheetName && (
            <TableHead className="text-[14px] font-bold" align="center">
              Action
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Render categorized data by dates */}
        {Object.entries(categorizedData).map(([date, rows], dateIndex) => (
          <React.Fragment key={dateIndex}>
            <TableRow className="bg-gray-200">
              <TableCell
                colSpan={headers.length + 1}
                className="text-left text-lg font-bold"
              >
                {date}
              </TableCell>
            </TableRow>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  if (sheetName && cellIndex === row.length - 1) {
                    return (
                      <React.Fragment key={cellIndex}>
                        <TableCell>{cell}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Delete
                              rowIndex={rowIndex}
                              isAllowed={role === "Admin"}
                              sheetName={sheetName}
                            />
                            <Edit
                              isAllowed={role === "Admin"}
                              data={row}
                              rowIndex={rowIndex}
                              sheetName={sheetName}
                            />
                          </div>
                        </TableCell>
                      </React.Fragment>
                    );
                  } else {
                    return <TableCell key={cellIndex}>{cell}</TableCell>;
                  }
                })}
              </TableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

export default DailyWorkTable;
