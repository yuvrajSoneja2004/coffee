"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
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

function DailyWorkDataDialogue() {
  const [slNo, setSlNo] = useState("");
  const [typeOfWork, setTypeOfWork] = useState([]);
  const [detailsOfWork, setDetailsOfWork] = useState(allData[0]);
  const [singleDetailOfWork, setSingleDetailOfWork] = useState("");
  const [treeListValue, setTreeListValue] = useState("");
  const [maleLabourCount, setMaleLabourCount] = useState("");
  const [femaleLabourCount, setFemaleLabourCount] = useState("");
  const [block, setBlock] = useState("");
  const [rowFrom, setRowFrom] = useState("");
  const [rowTo, setRowTo] = useState("");
  const [treeCount, setTreeCount] = useState("");

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year
    return `${day}.${month}.${year}`;
  }

  const handleSave = () => {
    // Construct your payload with the state values
    const payload = {
      slNo,
      date: formatDate(new Date()),
      typeOfWork,
      detailsOfWork,
      treeListValue,
      maleLabourCount,
      femaleLabourCount,
      block,
      rowFrom,
      rowTo,
      treeCount,
    };

    // Send HTTP request to the server
    fetch("/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Data saved successfully!");
        } else {
          throw new Error("Failed to save data");
        }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="flex-center flex gap-2">
          <Plus />
          Add Data
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogDescription className="">
            <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4">
              <div>
                <label htmlFor="SL.No.">SL.No</label>
                <Input
                  className="mt-2"
                  value={slNo}
                  onChange={(e) => setSlNo(e.target.value)}
                />
              </div>
              <div className="">
                <label htmlFor="Date">Date</label>
                <Input className="mt-2" value={formatDate(new Date())} />
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
                          onClick={() => setSingleDetailOfWork(detail)}
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
                      placeholder={treeCount}
                      value={treeCount}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {treeList.map((work, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() => {
                          setTreeCount(work);
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
                <Input className="mt-2" type="number" />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Female Labour Count</label>
                <Input className="mt-2" />
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
                <Input className="mt-2" />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Row to</label>
                <Input className="mt-2" />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Tree Count</label>
                <Input className="mt-2" />
              </div>
              <Button>Save Data</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DailyWorkDataDialogue;
