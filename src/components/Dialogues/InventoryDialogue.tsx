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
import { Plus, RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/store";
import axios from "axios";
import { formatDate } from "@/lib/formatDate";
import { handleReload } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
function InventoryDialogue() {
  const [material, setMaterial] = useState<string>("");
  const [materialList, setMaterialList] = useState([]);
  const [materialTypeIndex, setMaterialTypeIndex] = useState<number>(0);
  const [baseItem, setBaseItem] = useState<string>("");
  const [currentItemUnit, setCurrentItemUnit] = useState("");
  const [qty, setQty] = useState<string>("0");
  const { slNoStarts } = useAppSelector((state) => state.authSlice);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSave = () => {
    // Construct your payload with the state values
    const payload = {
      date: formatDate(),
      material,
      baseItem,
      currentItemUnit,
      qty,
    };

    // Send HTTP request to the server
    fetch("/api/saveInventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        setOpen(false);
        if (response.ok) {
          dispatch(handleReload(12));
          console.log("Inventory saved successfully!");
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
          `/api/getFields?sheetName=LIST AND OPTIONS`,
        );
        // Extracting all materials list from res
        // setMaterialList(data);
        console.log("Inventory res", data);
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

  // const handleInventoryFilter = async (filterOption: string) => {
  //   try {
  //     const { data } = await axios.get(
  //       `/api/filterInventory?filterOption=${filterOption}`,
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <Dialog open={open}>
      <div className="flex items-center justify-between">
        <DialogTrigger>
          <Button
            className="flex-center flex gap-2"
            onClick={() => setOpen(true)}
          >
            <Plus />
            Add Data
          </Button>
        </DialogTrigger>
        {/* Filter options  */}
        <Button onClick={() => dispatch(handleReload(12))}>
          <RotateCcw size={16} />
        </Button>
      </div>
      <DialogContent className="" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogDescription className="">
            <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4">
              <div>
                <label htmlFor="Date">Date</label>
                <Input className="mt-2" value={formatDate()} />
              </div>
              {/* Dropdown  */}
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
                      .filter((item) => item !== "" && item !== undefined)
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
                      placeholder={baseItem}
                      value={baseItem}
                      disabled={material === ""}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <ScrollArea className="h-[200px] w-[150px] rounded-md border p-4">
                      {materialList
                        ?.slice(1)
                        ?.map((subArray) => subArray[materialTypeIndex])
                        .filter((item) => item !== "" && item !== undefined)
                        .map((work, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => {
                              setBaseItem(removeBracketsAndContent(work));
                              setCurrentItemUnit(extractUnit(work) as string);
                            }}
                          >
                            {removeBracketsAndContent(work)}
                          </DropdownMenuItem>
                        ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* UNIT  */}
              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full flex-col items-start">
                    <label htmlFor="">Unit</label>
                    <Input
                      className="mt-2"
                      placeholder={currentItemUnit}
                      value={currentItemUnit}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent></DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <label htmlFor="Date">Quantity</label>
                <div className="flex items-center gap-2">
                  <Input
                    className="mt-2"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                  <span>{currentItemUnit}</span>
                </div>
              </div>

              <Button onClick={handleSave}>Save Data</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default InventoryDialogue;
