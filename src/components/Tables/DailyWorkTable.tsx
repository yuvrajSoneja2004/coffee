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
import Edit from "../Actions/Edit";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  handleReload,
  handleSlNo,
  handleSlNoMaterial,
} from "@/redux/features/authSlice";

interface DailyWorkTableProps {
  sheetName: string;
}

function DailyWorkTable({ sheetName }: DailyWorkTableProps) {
  const [headingRows, setHeadingRows] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { name, role, reloadHandler } = useAppSelector(
    (state) => state.authSlice,
  );
  const dispatch = useDispatch();

  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/googletest?sheetName=${sheetName}`,
      );
      console.log(data);
      dispatch(handleReload(1));
      if ((sheetName = "Daily Work Data")) {
        dispatch(handleSlNo({ no: data?.length }));
      } else if ((sheetName = "Material")) {
        console.log("ypu this is material");
        dispatch(handleSlNoMaterial({ no: data?.length }));
      }

      setHeadingRows(data);
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
  if (headingRows === "EMPTY") return <NoInfoFound />;

  return (
    <Table className="border-stroke px-7.5 dark:border-strokedark dark:bg-boxdark mt-6 rounded-md border bg-white py-6 shadow-default">
      <TableCaption>A list of all the recorded data.</TableCaption>
      <TableHeader>
        <TableRow className="text-sm">
          {/* Render table headings */}
          {headingRows[0]?.map((heading, index) => (
            <TableHead className="text-[14px] font-bold" key={index}>
              {heading}
            </TableHead>
          ))}
          {sheetName === "DAILY WORK DATA" && (
            <TableHead className="text-[14px] font-bold">Action</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Render table rows */}
        {headingRows.slice(1).map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => {
              if (
                sheetName === "DAILY WORK DATA" &&
                cellIndex === row.length - 1
              ) {
                // If it's the "Action" column, render a button
                return (
                  <React.Fragment key={cellIndex}>
                    <TableCell>{cell}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Delete
                          rowIndex={rowIndex}
                          isAllowed={role === "Admin"}
                        />
                        <Edit isAllowed={role === "Admin"} />
                      </div>
                    </TableCell>
                  </React.Fragment>
                );
              } else {
                // Otherwise, render regular cell content
                return <TableCell key={cellIndex}>{cell}</TableCell>;
              }
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DailyWorkTable;
