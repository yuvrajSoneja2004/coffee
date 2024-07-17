"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axiosInstance } from "@/lib/axiosInstance";

interface Props {
  sheetName: string;
  type: string;
  listIndex: number;
  columnToWrite: string;
  isUnitRequired?: boolean;
}
// TODO: Continue from here.
function ManageDialogue({
  sheetName,
  type,
  listIndex,
  columnToWrite,
  isUnitRequired = true,
}: Props) {
  const [name, setName] = useState<string>("");
  const [unit, setUnit] = useState(["GMS", "KG", "LTR", "MT"]);
  const [currentUnit, setCurrentUnit] = useState<string>(unit[0]);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    // Construct your payload with the state values
    const payload = {
      sheetName,
      name,
      currentUnit,
      listIndex,
      columnToWrite,
    };
  
    try {
      // Send HTTP request to the server using axios
      const response = await axiosInstance.post("/api/addOptions", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      setOpen(false);
      if (response.status === 200) {
        console.log("Inventory saved successfully!");
        console.log(response);
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  

  return (
    <Dialog open={open}>
      <DialogTrigger>
        <button
          className="rounded-md bg-themePurple px-3 py-1"
          onClick={() => setOpen(true)}
        >
          <Plus size={20} color="#fff" />
        </button>
      </DialogTrigger>
      <DialogContent className="" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <h1>Add {type}</h1>
          <DialogDescription className="">
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="Date">Name</label>
                <Input
                  className="mt-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* UNIT  */}
              {isUnitRequired && (
                <div className="mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full flex-col items-start">
                      <label>Unit</label>
                      <Input
                        className="mt-2"
                        placeholder={currentUnit}
                        value={currentUnit}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {unit.map((un, index) => {
                        return (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => setCurrentUnit(un)}
                          >
                            {un}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <Button onClick={handleSave}>Save Data</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ManageDialogue;
