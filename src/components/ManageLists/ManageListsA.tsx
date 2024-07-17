"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import ManageDialogue from "../Dialogues/ManageListsDialogue";
import { axiosInstance } from "@/lib/axiosInstance";
import { useAppSelector } from "@/redux/store";

function ManageListsA() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const { sheetId } = useAppSelector((state) => state.authSlice);
  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(`/api/manageListsA`);
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

  console.log(
    data
      ?.slice(1)
      ?.map((subArray) => subArray[5])
      .filter((item) => item !== ""),
    "soriye",
  );
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
        {/* Nursery */}
        <Table className="-z-30 bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">Nursery</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS A"
                  type="Nursery"
                  listIndex={2}
                  columnToWrite="B"
                  isUnitRequired={false}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice(1)
              ?.map((subArray) => subArray[0])
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
        {/* Field */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">Field</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS A"
                  type="Field"
                  listIndex={1}
                  columnToWrite="B"
                  isUnitRequired={false}
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
        {/* Tree Management */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">
                Tree Management
              </TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS A"
                  type="Tree Management"
                  listIndex={2}
                  columnToWrite="C"
                  isUnitRequired={false}
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
        {/* Processing */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">Processing</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS A"
                  type="Processing"
                  listIndex={3}
                  columnToWrite="D"
                  isUnitRequired={false}
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
        {/* Misc */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">Misc</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS A"
                  type="Misc"
                  listIndex={4}
                  columnToWrite="E"
                  isUnitRequired={false}
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
        {/* TreeList */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">TreeList</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS A"
                  type="TreeList"
                  listIndex={5}
                  columnToWrite="F"
                  isUnitRequired={false}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice(1)
              ?.map((subArray) => subArray[5])
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
        {/* Blocks */}
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90%] font-bold">Blocks</TableHead>
              <TableHead className="font-bold">
                <ManageDialogue
                  sheetName="LIST AND OPTIONS A"
                  type="Blocks"
                  listIndex={6}
                  columnToWrite="G"
                  isUnitRequired={false}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice(1)
              ?.map((subArray) => subArray[6])
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

export default ManageListsA;
