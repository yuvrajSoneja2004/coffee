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
import { handleSlNo, handleSlNoMaterial } from "@/redux/features/authSlice";
import { setMaterialList } from "@/redux/features/inventoryFilter";
import Edit from "../Actions/DailyMaterialData/Edit";

interface OthersTableProps {
  sheetName: string;
}

export default function OthersTable({ sheetName }: OthersTableProps) {
  const [headingRows, setHeadingRows] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Selecting relevant parts of state using custom hooks
  const { role } = useAppSelector((state) => state.authSlice);
  const { materialListB, isFilterApplied } = useAppSelector(
    (state) => state.inventoryFilter,
  );
  const dispatch = useDispatch();

  // Function to fetch data from API
  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/googletest?sheetName=${sheetName}`,
      );
      console.log(data);

      // Dispatch actions based on sheetName
      if ((sheetName = "Daily Work Data")) {
        dispatch(handleSlNo({ no: data?.length - 1 }));
      } else if (sheetName === "MATERIAL") {
        console.log("Material", data?.length);
        dispatch(handleSlNoMaterial({ no: data?.length }));
      }

      // Set data and dispatch material list if filter not applied
      setHeadingRows(data);
      if (!isFilterApplied) {
        dispatch(setMaterialList(data));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial load and reloadHandler change
  useEffect(() => {
    getData();
  }, []);

  // Show loader while loading data
  if (isLoading) return <Loader additionalStyles="mt-5" />;

  // Determine data to render based on sheetName
  const dataToRender =
    sheetName === "INVENTORY"
      ? materialListB.slice(isFilterApplied ? 0 : 1)
      : headingRows.slice(1);

  // Show NoInfoFound component if no data
  if (dataToRender.length === 0) return <NoInfoFound />;

  // Render the table
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
          {sheetName && (
            <TableHead className="text-[14px] font-bold" align="center">
              Action
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Render table rows */}
        {dataToRender.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.isArray(row) ? (
              row.map((cell, cellIndex) => {
                if (sheetName && cellIndex === row.length - 1) {
                  // If it's the "Action" column, render actions
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
                  // Otherwise, render regular cell content
                  return <TableCell key={cellIndex}>{cell}</TableCell>;
                }
              })
            ) : (
              <TableCell>{row}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
