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

function MaterialDialogue() {
  const [slNo, setSlNo] = useState("");
  const [material, setMaterial] = useState<string>("");
  const [materialList, setMaterialList] = useState([]);
  const [boughtIssuedBy, setBoughtIssuedBy] = useState("");
  const [baseMaterial, setBaseMaterial] = useState("");
  const [singleUnit, setSingleUnit] = useState("");
  const [inQty, setInQty] = useState("");
  const [outQty, setOutQty] = useState("");
  const [remarks, setRemarks] = useState("");
  const [materialTypeIndex, setMaterialTypeIndex] = useState<number>(0);
  const [currentItemUnit, setCurrentItemUnit] = useState("");

  const { slNoMaterial, slNoStarts } = useAppSelector(
    (state) => state.authSlice,
  );
  const [open, setOpen] = useState(false);

  function formatDate(date: Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year
    return `${day}.${month}.${year}`;
  }

  const deleteFromInventory = async () => {
    const payload = {
      date: formatDate(new Date()),
      material,
      baseMaterial,
      currentItemUnit,
      qty: inQty,
    };

    try {
      // Send HTTP request to the server
      const response = await fetch("/api/deleteFromInventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setOpen(false);
      const serverRes = await response.json();
      if (serverRes?.msg === "ITEM_NOT_FOUND_ON_INVENTORY") {
        alert("No such inventory");
      } else if (serverRes?.msg === "NOT_ENOUGH_QTY") {
        alert("Not enough Qty");
      } else {
        handleSave();
      }
      if (response.ok) {
        console.log("Data saved successfully!");
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleSave = async () => {
    // Construct your payload with the state values
    const payload = {
      slNo: slNoStarts,
      date: formatDate(new Date()),
      boughtIssuedBy,
      baseMaterial,
      singleUnit: currentItemUnit,
      inQty,
      outQty,
      remarks,
    };

    try {
      // Send HTTP request to the server
      const response = await fetch("/api/googlematerial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setOpen(false);

      if (response.ok) {
        console.log("LOOOOP");
        console.log("Data saved successfully!");
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    const getFieldsData = async () => {
      try {
        const { data } = await axios.get(
          `/api/getFields?sheetName=LIST AND OPTIONS`,
        );
        // Extracting all materials list from res
        setMaterialList(data);
        // console.log("Inventory res", items);
      } catch (error) {
        console.log(error);
      }
    };
    getFieldsData();
  }, []);

  // Utility functions to extract data using regex
  const extractUnit = (str: string) => {
    const match = str.match(/\[(.*?)\]/);
    return match ? match[1] : null;
  };

  const removeBracketsAndContent = (str: string) => {
    return str?.replace(/\[.*?\]/, "").trim();
  };
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
              <div className="">
                <label htmlFor="Date">Date</label>
                <Input className="mt-2" value={formatDate(new Date())} />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Bought/ Issued By</label>
                <Input
                  className="mt-2"
                  type="text"
                  value={boughtIssuedBy}
                  onChange={(e) => setBoughtIssuedBy(e.target.value)}
                />
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full cursor-pointer flex-col items-start">
                    <label htmlFor="">Material</label>
                    <Input
                      className="mt-2"
                      value={material}
                      placeholder={material}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {materialList
                      ?.slice(1)
                      ?.map((subArray) => subArray[0])
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
              {/* Baseitem field  */}
              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex w-full flex-col items-start"
                    disabled={material === ""}
                  >
                    <label htmlFor="">
                      {material === "" ? "Select material type" : material}
                    </label>
                    <Input
                      className="mt-2"
                      placeholder={baseMaterial}
                      value={baseMaterial}
                      disabled={material === ""}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {materialList
                      ?.slice(1)
                      ?.map((subArray) => subArray[materialTypeIndex])
                      .filter((item) => item !== "")
                      .map((work, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => {
                            setBaseMaterial(removeBracketsAndContent(work));
                            setCurrentItemUnit(extractUnit(work) as string);
                          }}
                        >
                          {removeBracketsAndContent(work)}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2">
                <label htmlFor="">Unit</label>
                <Input
                  className="mt-2"
                  placeholder={singleUnit}
                  value={currentItemUnit}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">IN Qty</label>
                <Input
                  className="mt-2"
                  type="text"
                  value={inQty}
                  onChange={(e) => setInQty(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">OUT Qty</label>
                <Input
                  className="mt-2"
                  value={outQty}
                  onChange={(e) => setOutQty(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">Remarks</label>
                <Input
                  className="mt-2"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <Button
                onClick={() => {
                  // handleSave();
                  deleteFromInventory();
                }}
              >
                Save Data
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default MaterialDialogue;
