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
import { Plus, RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { handleReload } from "@/redux/features/authSlice";
import { useToast } from "../ui/use-toast";
import { formatDate } from "@/lib/formatDate";
import { useForm, Controller } from "react-hook-form";

function DailyWorkDataDialogue() {
  const { toast } = useToast();

  const [material, setMaterial] = useState<string>("");
  const [materialList, setMaterialList] = useState([]);
  const [materialTypeIndex, setMaterialTypeIndex] = useState<number>(0);
  const [singleDetailOfWork, setSingleDetailOfWork] = useState("");
  const [treeListValue, setTreeListValue] = useState("");
  const [block, setBlock] = useState("");
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
      maleLabourCount: "",
      femaleLabourCount: "",
      rowFrom: "",
      rowTo: "",
      treeCount: "",
    },
  });

  const handleSave = (data, hasToReload) => {
    const payload = {
      slNo: slNoStarts,
      date: formatDate(),
      material,
      singleDetailOfWork,
      treeListValue,
      maleLabourCount: data.maleLabourCount,
      femaleLabourCount: data.femaleLabourCount,
      block,
      rowFrom: data.rowFrom,
      rowTo: data.rowTo,
      treeCount: data.treeCount,
    };

    fetch("/api/googletest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          if (hasToReload) {
            setOpen(false);
            dispatch(handleReload(12));
            resetForm();
          }
          console.log("Data saved successfully!");
        } else {
          throw new Error("Failed to save data");
        }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const handleSaveAndAddMore = (data) => {
    handleSave(data, false);
    toast({
      title: "Successfully Saved Daily Work Data Info.",
    });
    setOpen(true);
    resetForm();
  };

  const resetForm = () => {
    setMaterial("");
    setSingleDetailOfWork("");
    setTreeListValue("");
    setBlock("");
    reset();
  };

  useEffect(() => {
    const getFieldsData = async () => {
      try {
        const { data } = await axios.get(
          `/api/getFields?sheetName=LIST AND OPTIONS A`,
        );
        setMaterialList(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getFieldsData();
  }, []);

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
        <Button onClick={() => dispatch(handleReload(12))}>
          <RotateCcw size={16} />
        </Button>
      </div>
      <DialogContent className="" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogDescription className="">
            <form onSubmit={handleSubmit((data) => handleSave(data, true))}>
              <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4">
                <div>
                  <label htmlFor="SL.No.">SL.No</label>
                  <Input className="mt-2" value={slNoStarts} readOnly />
                </div>
                <div>
                  <label htmlFor="Date">Date</label>
                  <Input className="mt-2" value={formatDate()} readOnly />
                </div>
                <div className="mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full cursor-pointer flex-col items-start">
                      <label htmlFor="">Type of Work</label>
                      <Input
                        className="mt-2"
                        value={material}
                        placeholder={material}
                        readOnly
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
                <div className="mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full flex-col items-start">
                      <label htmlFor="">Details of work done</label>
                      <Input
                        className="mt-2"
                        placeholder="Select Details of Work Done"
                        value={singleDetailOfWork}
                        readOnly
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {materialList
                        ?.slice(1)
                        ?.map((subArray) => subArray[materialTypeIndex])
                        .filter((item) => item !== "" && item !== undefined)
                        .map((work, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => {
                              setSingleDetailOfWork(work);
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
                      <label htmlFor="">TreeList</label>
                      <Input
                        className="mt-2"
                        placeholder="Select Tree List"
                        value={treeListValue}
                        readOnly
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {materialList
                        ?.slice(1)
                        ?.map((subArray) => subArray[6])
                        .filter((item) => item !== "" && item !== undefined)
                        .map((work, index) => (
                          <DropdownMenuItem
                            key={index}
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
                  <label htmlFor="maleLabourCount">Male Labour Count</label>
                  <Controller
                    name="maleLabourCount"
                    control={control}
                    rules={{
                      required: "This field is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Please enter a valid number",
                      },
                    }}
                    render={({ field }) => (
                      <Input className="mt-2" type="number" {...field} />
                    )}
                  />
                  {errors.maleLabourCount && (
                    <p className="text-red-500">
                      {errors.maleLabourCount.message}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <label htmlFor="femaleLabourCount">Female Labour Count</label>
                  <Controller
                    name="femaleLabourCount"
                    control={control}
                    rules={{
                      required: "This field is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Please enter a valid number",
                      },
                    }}
                    render={({ field }) => (
                      <Input className="mt-2" type="number" {...field} />
                    )}
                  />
                  {errors.femaleLabourCount && (
                    <p className="text-red-500">
                      {errors.femaleLabourCount.message}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full flex-col items-start">
                      <label htmlFor="">Block</label>
                      <Input
                        className="mt-2"
                        value={block}
                        placeholder="Select Block"
                        readOnly
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {materialList
                        ?.slice(1)
                        ?.map((subArray) => subArray[7])
                        .filter((item) => item !== "" && item !== undefined)
                        .map((work, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => {
                              setBlock(work);
                            }}
                          >
                            {work}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2">
                  <label htmlFor="rowFrom">Row from</label>
                  <Controller
                    name="rowFrom"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Input className="mt-2" {...field} />
                    )}
                  />
                  {errors.rowFrom && (
                    <p className="text-red-500">{errors.rowFrom.message}</p>
                  )}
                </div>
                <div className="mt-2">
                  <label htmlFor="rowTo">Row to</label>
                  <Controller
                    name="rowTo"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Input className="mt-2" {...field} />
                    )}
                  />
                  {errors.rowTo && (
                    <p className="text-red-500">{errors.rowTo.message}</p>
                  )}
                </div>
                <div className="mt-2">
                  <label htmlFor="treeCount">Tree Count</label>
                  <Controller
                    name="treeCount"
                    control={control}
                    rules={{
                      required: "This field is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Please enter a valid number",
                      },
                    }}
                    render={({ field }) => (
                      <Input className="mt-2" {...field} />
                    )}
                  />
                  {errors.treeCount && (
                    <p className="text-red-500">{errors.treeCount.message}</p>
                  )}
                </div>
                <div className="mt-2"></div>
                <Button type="submit">Save Data</Button>
                <Button
                  type="button"
                  onClick={handleSubmit(handleSaveAndAddMore)}
                >
                  Save & Add More
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DailyWorkDataDialogue;