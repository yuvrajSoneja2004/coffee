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
import { handleReload } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { formatDate } from "@/lib/formatDate";
import { useForm, Controller } from "react-hook-form";

function MaterialDialogue() {
  const [material, setMaterial] = useState<string>("");
  const [materialList, setMaterialList] = useState([]);
  const [baseMaterial, setBaseMaterial] = useState("");
  const [materialTypeIndex, setMaterialTypeIndex] = useState<number>(0);
  const [currentItemUnit, setCurrentItemUnit] = useState("");
  const [formErrors, setFormErrors] = useState({
    material: "",
    baseMaterial: "",
    currentItemUnit: "",
  });
  const dispatch = useDispatch();

  const { slNoStarts } = useAppSelector((state) => state.authSlice);
  const porn  = useAppSelector((state) => state.authSlice);
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      boughtIssuedBy: "",
      qtyType: "in",
      qty: "",
      remarks: "",
    },
  });

  const qtyType = watch("qtyType");

  const validateCustomFields = () => {
    let isValid = true;
    const newErrors = { material: "", baseMaterial: "", currentItemUnit: "" };

    if (material === "") {
      newErrors.material = "Material is required";
      isValid = false;
    }
    if (baseMaterial === "") {
      newErrors.baseMaterial = "Base material is required";
      isValid = false;
    }
    if (currentItemUnit === "") {
      newErrors.currentItemUnit = "Unit is required";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const deleteFromInventory = async (data) => {
    if (!validateCustomFields()) {
      return;
    }

    const payload = {
      date: formatDate(),
      material,
      baseMaterial,
      currentItemUnit,
      qtyType: data.qtyType,
      qty: data.qty,
    };

    try {
      const response = await fetch("/api/deleteFromInventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setOpen(false);
      const serverRes = await response.json();
      if (serverRes?.msg === "INSUFFICIENT_MATERIALS") {
        alert("Insufficient materials available in inventory");
      } else if (serverRes?.msg === "BASEITEM_NOT_FOUND") {
        alert("Enough baseItems not found");
      } else {
        handleSave(data);
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

  const handleSave = async (data) => {
    const payload = {
      slNo: slNoStarts,
      date: formatDate(),
      boughtIssuedBy: data.boughtIssuedBy,
      baseMaterial,
      singleUnit: currentItemUnit,
      inQty: data.qtyType === "in" ? data.qty : "",
      outQty: data.qtyType === "out" ? data.qty : "",
      remarks: data.remarks,
    };

    try {
      const response = await fetch("/api/googlematerial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setOpen(false);
      dispatch(handleReload(12));

      if (response.ok) {
        console.log("Data saved successfully!");
        reset();
        setMaterial("");
        setBaseMaterial("");
        setCurrentItemUnit("");
        setFormErrors({ material: "", baseMaterial: "", currentItemUnit: "" });
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
        setMaterialList(data);
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

  console.log(porn , 'its like pron')
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
            <form onSubmit={handleSubmit(deleteFromInventory)}>
              <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4">
                <div>
                  <label htmlFor="SL.No.">SL.No</label>
                  <Input className="mt-2" value={slNoStarts} readOnly />
                </div>
                <div className="">
                  <label htmlFor="Date">Date</label>
                  <Input className="mt-2" value={formatDate()} readOnly />
                </div>
                <div className="mt-2">
                  <label htmlFor="boughtIssuedBy">Bought/ Issued By</label>
                  <Controller
                    name="boughtIssuedBy"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Input className="mt-2" {...field} />
                    )}
                  />
                  {errors.boughtIssuedBy && (
                    <p className="text-red-500">
                      {errors.boughtIssuedBy.message}
                    </p>
                  )}
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full cursor-pointer flex-col items-start">
                      <label htmlFor="">Material</label>
                      <Input
                        className="mt-2"
                        value={material}
                        placeholder={material || "Select Material"}
                        readOnly
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
                              setFormErrors((prev) => ({
                                ...prev,
                                material: "",
                              }));
                            }}
                          >
                            {work}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {formErrors.material && (
                    <p className="text-red-500">{formErrors.material}</p>
                  )}
                </div>
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
                        placeholder={baseMaterial || "Select Base Material"}
                        value={baseMaterial}
                        disabled={material === ""}
                        readOnly
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
                              setFormErrors((prev) => ({
                                ...prev,
                                baseMaterial: "",
                                currentItemUnit: "",
                              }));
                            }}
                          >
                            {removeBracketsAndContent(work)}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {formErrors.baseMaterial && (
                    <p className="text-red-500">{formErrors.baseMaterial}</p>
                  )}
                </div>
                <div className="mt-2">
                  <label htmlFor="">Unit</label>
                  <Input
                    className="mt-2"
                    placeholder={currentItemUnit || "Unit"}
                    value={currentItemUnit}
                    readOnly
                  />
                  {formErrors.currentItemUnit && (
                    <p className="text-red-500">{formErrors.currentItemUnit}</p>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-center">
                  <label htmlFor="inQty">IN Qty</label>
                  <Controller
                    name="qtyType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="ml-2 w-4"
                        type="radio"
                        value="in"
                        checked={field.value === "in"}
                        onChange={() => setValue("qtyType", "in")}
                        id="inQty"
                      />
                    )}
                  />
                </div>
                <div className="mt-2 flex items-center justify-center">
                  <label htmlFor="outQty">OUT Qty</label>
                  <Controller
                    name="qtyType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="ml-2 w-4"
                        type="radio"
                        value="out"
                        checked={field.value === "out"}
                        onChange={() => setValue("qtyType", "out")}
                        id="outQty"
                      />
                    )}
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="qty">Enter {qtyType.toUpperCase()} QTY</label>
                  <Controller
                    name="qty"
                    control={control}
                    rules={{
                      required: "This field is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Please enter a valid number",
                      },
                    }}
                    render={({ field }) => (
                      <Input className="mt-2" {...field} />
                    )}
                  />
                  {errors.qty && (
                    <p className="text-red-500">{errors.qty.message}</p>
                  )}
                </div>
                <div className="mt-2">
                  <label htmlFor="remarks">Remarks</label>
                  <Controller
                    name="remarks"
                    control={control}
                    rules={{
                      required: "This field is required",
                      maxLength: {
                        value: 200,
                        message: "Remarks should not exceed 200 characters",
                      },
                    }}
                    render={({ field }) => (
                      <Input className="mt-2" {...field} />
                    )}
                  />
                  {errors.remarks && (
                    <p className="text-red-500">{errors.remarks.message}</p>
                  )}
                </div>

                <Button type="submit">Save Data</Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default MaterialDialogue;