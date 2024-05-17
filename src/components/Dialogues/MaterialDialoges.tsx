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
import { useAppSelector } from "@/redux/store";

function MaterialDialogue() {
  const [slNo, setSlNo] = useState("");
  const [boughtIssuedBy, setBoughtIssuedBy] = useState("");
  const [baseMaterial, setBaseMaterial] = useState("");
  const [singleUnit, setSingleUnit] = useState("");
  const [inQty, setInQty] = useState("");
  const [outQty, setOutQty] = useState("");
  const [remarks, setRemarks] = useState("");

  const { slNoMaterial } = useAppSelector((state) => state.authSlice);
  const [open, setOpen] = useState(false);

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year
    return `${day}.${month}.${year}`;
  }

  const handleSave = () => {
    // Construct your payload with the state values
    const payload = {
      slNo: slNoMaterial,
      date: formatDate(new Date()),
      boughtIssuedBy,
      baseMaterial,
      singleUnit,
      inQty,
      outQty,
      remarks,
    };

    // Send HTTP request to the server
    fetch("/api/googlematerial", {
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
                <Input className="mt-2" value={slNoMaterial} />
              </div>
              <div className="">
                <label htmlFor="Date">Date</label>
                <Input className="mt-2" value={formatDate(new Date())} />
              </div>
              {/* Dropdown  */}
              <div className="mt-2">
                <label htmlFor="SL.No.">Bought/ Issued By</label>
                <Input
                  className="mt-2"
                  type="text"
                  value={boughtIssuedBy}
                  onChange={(e) => setBoughtIssuedBy(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="SL.No.">BaseMaterial</label>
                <Input
                  className="mt-2"
                  type="text"
                  value={baseMaterial}
                  onChange={(e) => setBaseMaterial(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full flex-col items-start">
                    <label htmlFor="">Unit</label>
                    <Input
                      className="mt-2"
                      placeholder={singleUnit}
                      value={setSingleUnit}
                      onChange={(e) => setTreeListValue(e.target.value)}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["GMS", "KG"].map((work, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() => {
                          setSingleUnit(work);
                        }}
                      >
                        {work}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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

              <Button onClick={handleSave}>Save Data</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default MaterialDialogue;
