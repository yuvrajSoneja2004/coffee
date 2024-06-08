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
import { useAppSelector } from "@/redux/store";
import axios from "axios";

function DailyWorkDataDialogue() {
  const [allInputs, setAllInputs] = useState([]);
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
  const { slNoStarts } = useAppSelector((state) => state.authSlice);
  const [open, setOpen] = useState(false);

  function formatDate(date: Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year
    return `${day}.${month}.${year}`;
  }

  const handleSave = () => {
    // Construct your payload with the state values
    const payload = {
      slNo: slNoStarts,
      date: formatDate(new Date()),
      typeOfWork,
      singleDetailOfWork,
      treeListValue,
      maleLabourCount,
      femaleLabourCount,
      block,
      rowFrom,
      rowTo,
      treeCount,
    };

    // Send HTTP request to the server
    fetch("/api/googletest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        setOpen(false);
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

  useEffect(() => {
    const getFieldsData = async () => {
      try {
        const { data } = await axios.get(
          `/api/getFields?sheetName=LIST AND OPTIONS A`,
        );
        // Extracting all materials list from res
        setAllInputs(data);
        console.log(data);
        // console.log("Inventory res", items);
      } catch (error) {
        console.log(error);
      }
    };
    getFieldsData();
  }, []);
  return (
    <Dialog open={open}>
      <DialogTrigger>
        <Button
          className="flex-center flex gap-2"
          onClick={() => setOpen(true)}
        >
          <Plus />
          Add Data
        </Button>
      </DialogTrigger>
      <DialogContent className="" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogDescription className="">
            <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4">
              <div>
                <label htmlFor="SL.No.">SL.No</label>
                <Input className="mt-2" value={slNoStarts} />
              </div>
              <div>
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
                    {allData
                      ?.slice(1)
                      ?.map((subArray) => subArray[2])
                      .filter((item) => item !== "")
                      .map((work, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => {
                            setMaterial(work);
                            setMaterialTypeIndex(index + 1);
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

export default DailyWorkDataDialogue;
