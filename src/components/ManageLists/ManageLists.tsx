"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ManageDialogue from "../Dialogues/ManageListsDialogue";
import { axiosInstance } from "@/lib/axiosInstance";
import { useAppSelector } from "@/redux/store";

function ManageLists() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { sheetId } = useAppSelector((state) => state.authSlice);

  const [data, setData] = useState([]);
  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(`/api/manageLists`);
      console.log(data);
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sheetId?.length > 1) {
      getData();
    }
  }, [sheetId]);

  // Utility functions to extract data using regex
  const extractUnit = (str: string) => {
    const match = str.match(/\[(.*?)\]/);
    return match ? match[1] : null;
  };

  const removeBracketsAndContent = (str: string) => {
    return str?.replace(/\[.*?\]/, "").trim();
  };
  return (
    <div className="-z-50 mx-auto max-w-7xl">
      {/* tables  */}
      <div className="-z-50 grid grid-cols-3 gap-3">
        {/* Material */}
        <Table className="-z-30 bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">Material</TableHead>
              <TableHead className="font-bold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice(1)
              ?.map((subArray) => subArray[0])
              .filter((item) => item !== "" && item !== undefined)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* BaseMaterial */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">BaseMaterial</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS"
                  type="BaseMaterial"
                  listIndex={1}
                  columnToWrite="B"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice(1)
              ?.map((subArray) => subArray[1])
              .filter((item) => item !== "" && item !== undefined)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {removeBracketsAndContent(item)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* Solutions */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">Solutions</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS"
                  type="Soluctions"
                  listIndex={2}
                  columnToWrite="C"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice(1)
              ?.map((subArray) => subArray[2])
              .filter((item) => item !== "" && item !== undefined)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {removeBracketsAndContent(item)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* Tools */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">Tools</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS"
                  type="Tools"
                  listIndex={3}
                  columnToWrite="D"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice(1)
              ?.map((subArray) => subArray[3])
              .filter((item) => item !== "" && item !== undefined)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {removeBracketsAndContent(item)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* Consumables */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">Consumables</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS"
                  type="Consumables"
                  listIndex={4}
                  columnToWrite="E"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice(1)
              ?.map((subArray) => subArray[4])
              .filter((item) => item !== "" && item !== undefined)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {removeBracketsAndContent(item)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ManageLists;
