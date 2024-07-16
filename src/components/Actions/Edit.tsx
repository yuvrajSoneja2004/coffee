"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Pencil, Plus } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { allData, blocks, treeList, typeofWork } from "@/lib/db";
import { useAppSelector } from "@/redux/store";
import axios from "axios";
import { axiosInstance } from "@/lib/axiosInstance";
import { formatDate } from "@/lib/formatDate";
// import { axiosInstance } from "@/lib/axiosInstance";

function Edit({ isAllowed, data, rowIndex, sheetName }: any) {
  const [
    slNo,
    date,
    workType,
    workDetail,
    treeListInfo,
    mLabourCount,
    fLabourCount,
    blockData,
    rFrom,
    rTo,
    tCount,
  ] = data;
  const [typeOfWork, setTypeOfWork] = useState(workType);
  const [detailsOfWork, setDetailsOfWork] = useState(allData[0]);
  const [singleDetailOfWork, setSingleDetailOfWork] = useState(workDetail);
  const [treeListValue, setTreeListValue] = useState(treeListInfo);
  const [maleLabourCount, setMaleLabourCount] = useState(mLabourCount);
  const [femaleLabourCount, setFemaleLabourCount] = useState(fLabourCount);
  const [block, setBlock] = useState(blockData);
  const [rowFrom, setRowFrom] = useState(rFrom);
  const [rowTo, setRowTo] = useState(rTo);
  const [treeCount, setTreeCount] = useState(tCount);
  // const { slNoStarts } = useAppSelector((state) => state.authSlice);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    // Construct your payload with the state values
    const payload = {
      slNo: slNo,
      date: date,
      typeOfWork,
      singleDetailOfWork,
      treeListValue,
      maleLabourCount,
      femaleLabourCount,
      block,
      rowFrom,
      rowTo,
      treeCount,
      rowIndex: rowIndex,
      sheetName: sheetName,
    };

    try {
      // Send HTTP request to the server using axios
      const response = await axiosInstance.put("/api/editSheet", payload);
      console.log(response.data);
      setOpen(false);
      console.log(response);
      console.log("lol saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTrigger>
        <button
          className="flex items-center justify-center rounded-md bg-green-500 p-1.5"
          disabled={!isAllowed}
          style={{ opacity: !isAllowed ? 0.5 : 1 }}
          onClick={() => setOpen(true)}
        >
          <Pencil size={13} color="#fff" />
        </button>
      </DialogTrigger>
      <DialogContent className="" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogDescription className="">
            <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4">
              <div>
                <label htmlFor="SL.No.">SL.No</label>
                <Input className="mt-2" value={slNo} autoFocus={false} />
              </div>
              <div className="">
                <label htmlFor="Date">Date</label>
                <Input className="mt-2" value={formatDate()} />
              </div>
              {/* Dropdown  */}
              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full cursor-pointer flex-col items-start">
                    <label htmlFor="">Type of Work</label>
                    <Input
                      className="mt-2"
                      value={typeOfWork}
                      placeholder={typeOfWork}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {typeofWork.map((work, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() => {
                          setTypeOfWork(work);
                          setDetailsOfWork(allData[i]);
                        }}
                      >
                        {work}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full flex-col items-start">
                    <label htmlFor="">Details of work done</label>
                    <Input
                      className="mt-2"
                      placeholder={singleDetailOfWork}
                      value={singleDetailOfWork}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {detailsOfWork.map((detail, index) => {
                      return (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => {
                            console.log(detail);
                            setSingleDetailOfWork(detail);
                          }}
                        >
                          {detail}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full flex-col items-start">
                    <label htmlFor="">TreeList</label>
                    <Input
                      className="mt-2"
                      placeholder={treeListValue}
                      value={treeListValue}
                      onChange={(e) => setTreeListValue(e.target.value)}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {treeList.map((work, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() => {
                          setTreeListValue(work);
                        }}
                      >
                        {work}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Male Labour Count</label>
                <Input
                  className="mt-2"
                  type="number"
                  value={maleLabourCount}
                  onChange={(e) => setMaleLabourCount(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Female Labour Count</label>
                <Input
                  className="mt-2"
                  value={femaleLabourCount}
                  onChange={(e) => setFemaleLabourCount(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full flex-col items-start">
                    <label htmlFor="">Block</label>
                    <Input className="mt-2" value={block} placeholder={block} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {blocks.map((block, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() => {
                          setBlock(block);
                        }}
                      >
                        {block}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Row from</label>
                <Input
                  className="mt-2"
                  value={rowFrom}
                  onChange={(e) => setRowFrom(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Row to</label>
                <Input
                  className="mt-2"
                  value={rowTo}
                  onChange={(e) => setRowTo(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Tree Count</label>
                <Input
                  className="mt-2"
                  value={treeCount}
                  onChange={(e) => setTreeCount(e.target.value)}
                />
              </div>
              <Button onClick={handleSave}>Save Data</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default Edit;
