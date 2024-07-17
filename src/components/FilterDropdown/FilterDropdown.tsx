"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { units } from "@/lib/db";
import { useDispatch } from "react-redux";
import { handleReload } from "@/redux/features/authSlice";
import {
  handleFilterUpdate,
  setMaterialList as setReduxMaterialList,
} from "../../redux/features/inventoryFilter";
import { axiosInstance } from "@/lib/axiosInstance";
import { useAppSelector } from "@/redux/store";

export function ComboboxDemo({ list, onSelect }: any) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? list.find((item) => item.value === value)?.label || value
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandList>
            {list?.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                  onSelect(currentValue);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.label || item}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function FilterDropdown() {
  const [localMaterialList, setLocalMaterialList] = React.useState([]);
  const [material, setMaterial] = React.useState<string>("");
  const [unit, setUnit] = React.useState<string>("");
  const [materialTypeIndex, setMaterialTypeIndex] = React.useState<number>(0);
  const { sheetId } = useAppSelector((state) => state.authSlice);
  const dispatch = useDispatch();

  // React.useEffect(() => {
  //   const getFieldsData = async () => {
  //     try {
  //       const { data } = await axiosInstance.get(
  //         `/api/getFields?sheetName=LIST AND OPTIONS`,
  //       );
  //       setLocalMaterialList(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getFieldsData();
  // }, []);
  React.useEffect(() => {
    const getFieldsData = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/getFields?sheetName=LIST AND OPTIONS`,
        );
        setLocalMaterialList(data);
      } catch (error) {
        console.log(error);
      }
    };
    // Avoid fetching fields data when sheetId is not fetched yet from user account schema. If sheetId exists , then its gonna fetch fields data
    if (sheetId?.length > 1) {
      getFieldsData();
    }
  }, [sheetId]);

  const handleMaterialSelect = (value: string) => {
    const index = localMaterialList
      .slice(1)
      .map((subArray) => subArray[0])
      .findIndex((item) => item === value);
    setMaterial(value);
    setMaterialTypeIndex(index + 1);
  };

  const handleApplyFilters = async () => {
    try {
      const { data } = await axiosInstance.post("/api/filterInventory", {
        material,
        unit,
      });
      console.log(data, "jagan pron");
      dispatch(handleFilterUpdate(true));
      dispatch(setReduxMaterialList(data));
      dispatch(handleReload(12));
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  return (
    <div className="h-full w-1/4">
      <div className="h-full rounded-md bg-gray-100 p-4 shadow-md">
        <h3 className="mb-4 text-lg font-semibold">Filters</h3>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Material
        </label>
        <ComboboxDemo
          list={localMaterialList
            ?.slice(1)
            ?.map((subArray) => ({ value: subArray[0], label: subArray[0] }))
            .filter((item) => item.value !== "" && item.value !== undefined)}
          onSelect={handleMaterialSelect}
        />
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Unit
          </label>
          <ComboboxDemo list={units} onSelect={(value) => setUnit(value)} />
        </div>
        <Button className="mt-4 w-full" onClick={handleApplyFilters}>
          Apply
        </Button>
      </div>
    </div>
  );
}

export default FilterDropdown;
