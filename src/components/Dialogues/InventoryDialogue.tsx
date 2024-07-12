"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Plus, RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { useAppSelector } from "@/redux/store";
import axios from "axios";
import { formatDate } from "@/lib/formatDate";
import { handleReload } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { ScrollArea } from "../ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function InventoryDialogue() {
  const [material, setMaterial] = useState<string>("");
  const [materialList, setMaterialList] = useState<any[]>([]);
  const [materialTypeIndex, setMaterialTypeIndex] = useState<number>(0);
  const [baseItem, setBaseItem] = useState<string>("");
  const [currentItemUnit, setCurrentItemUnit] = useState<string>("");
  const [qty, setQty] = useState<string>("0");
  const { slNoStarts } = useAppSelector((state) => state.authSlice);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      material: "",
      baseItem: "",
      currentItemUnit: "",
      qty: "0",
    },
  });

  const handleSave = handleSubmit((data) => {
    const payload = {
      date: formatDate(),
      material: data.material,
      baseItem: data.baseItem,
      currentItemUnit: data.currentItemUnit,
      qty: data.qty,
    };

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
          reset();
        } else {
          throw new Error("Failed to save data");
        }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  });

  useEffect(() => {
    const getFieldsData = async () => {
      try {
        const { data } = await axios.get(
          "/api/getFields?sheetName=LIST AND OPTIONS",
        );
        setMaterialList(data);
        console.log("Inventory res", data);
      } catch (error) {
        console.log(error);
      }
    };
    getFieldsData();
  }, []);

  const extractUnit = (str: string) => {
    const match = str.match(/\[(.*?)\]/);
    return match ? match[1] : null;
  };

  const removeBracketsAndContent = (str: string) => {
    return str?.replace(/\[.*?\]/, "").trim();
  };

  return (
    <Dialog open={open}>
      <div className="flex items-center justify-between">
        <Button
          className="flex-center flex gap-2"
          onClick={() => setOpen(true)}
        >
          <Plus />
          Add Data
        </Button>
        <Button onClick={() => dispatch(handleReload(12))}>
          <RotateCcw size={16} />
        </Button>
      </div>
      <DialogContent className="" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4">
              <div>
                <label htmlFor="Date">Date</label>
                <Input className="mt-2" value={formatDate()} readOnly />
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full cursor-pointer flex-col items-start">
                    <label htmlFor="Material">Material</label>
                    <Controller
                      name="material"
                      control={control}
                      rules={{ required: "Material is required" }}
                      render={({ field }) => (
                        <Input
                          className="mt-2"
                          {...field}
                          placeholder={material}
                        />
                      )}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {materialList?.slice(1)?.map(
                      (subArray, index) =>
                        subArray[0] && (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => {
                              setMaterial(subArray[0]);
                              setMaterialTypeIndex(index + 1);
                            }}
                          >
                            {subArray[0]}
                          </DropdownMenuItem>
                        ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex w-full flex-col items-start"
                    disabled={!material}
                  >
                    <label htmlFor="BaseItem">
                      {material ? material : "Select material type"}
                    </label>
                    <Controller
                      name="baseItem"
                      control={control}
                      rules={{ required: "Base Item is required" }}
                      render={({ field }) => (
                        <Input
                          className="mt-2"
                          {...field}
                          placeholder={baseItem}
                          disabled={!material}
                        />
                      )}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <ScrollArea className="h-[200px] w-[150px] rounded-md border p-4">
                      {materialList?.slice(1)?.map(
                        (subArray) =>
                          subArray[materialTypeIndex] && (
                            <DropdownMenuItem
                              key={subArray[materialTypeIndex]}
                              onClick={() => {
                                setBaseItem(
                                  removeBracketsAndContent(
                                    subArray[materialTypeIndex],
                                  ),
                                );
                                setCurrentItemUnit(
                                  extractUnit(subArray[materialTypeIndex]) ||
                                    "",
                                );
                              }}
                            >
                              {removeBracketsAndContent(
                                subArray[materialTypeIndex],
                              )}
                            </DropdownMenuItem>
                          ),
                      )}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2">
                <label htmlFor="CurrentItemUnit">Unit</label>
                <Input className="mt-2" value={currentItemUnit} readOnly />
              </div>
              <div>
                <label htmlFor="Quantity">Quantity</label>
                <Input
                  className="mt-2"
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
              <Button type="submit">Save Data</Button>
            </div>
            <div>
              {errors.material && (
                <p className="text-red-500">{errors.material.message}</p>
              )}
              {errors.baseItem && (
                <p className="text-red-500">{errors.baseItem.message}</p>
              )}
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default InventoryDialogue;
