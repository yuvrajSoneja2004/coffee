"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus, RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { handleReload } from "@/redux/features/authSlice";
import { formatDate } from "@/lib/formatDate";
import { useForm, Controller } from "react-hook-form";
import { axiosInstance } from "@/lib/axiosInstance";

function CashDialogue() {
  const [open, setOpen] = useState(false);
  const { slNoStarts } = useAppSelector((state) => state.authSlice);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      expense: "",
      amount: "",
      remarks: "",
    },
  });

  const handleSave = handleSubmit(async (data) => {
    // Construct your payload with the form data
    const payload = {
      slNo: slNoStarts,
      date: formatDate(),
      expense: data.expense,
      amount: data.amount,
      remarks: data.remarks,
    };

    try {
      // Send HTTP request to save data using axios
      const response = await axiosInstance.post("/api/saveCash", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setOpen(false);
      if (response.status === 200) {
        dispatch(handleReload(12));
        console.log("Data saved successfully!");
        reset();
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  });

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
            <div className="grid grid-cols-2 gap-x-10 gap-y-4">
              <div>
                <label htmlFor="SL.No.">SL.No</label>
                <Input className="mt-2" value={slNoStarts} readOnly />
              </div>
              <div>
                <label htmlFor="Date">Date</label>
                <Input className="mt-2" value={formatDate()} readOnly />
              </div>
              {/* Expense */}
              <div className="mt-2">
                <label htmlFor="Expense">Expense</label>
                <Controller
                  name="expense"
                  control={control}
                  rules={{
                    required: "This field is required",
                  }}
                  render={({ field }) => <Input className="mt-2" {...field} />}
                />
                {errors.expense && (
                  <p className="text-red-500">{errors.expense.message}</p>
                )}
              </div>
              {/* Amount */}
              <div className="mt-2">
                <label htmlFor="Amount">Amount</label>
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Please enter a valid number",
                    },
                  }}
                  render={({ field }) => (
                    <Input className="mt-2" type="number" {...field} />
                  )}
                />
                {errors.amount && (
                  <p className="text-red-500">{errors.amount.message}</p>
                )}
              </div>
              {/* Remarks */}
              <div className="mt-2">
                <label htmlFor="Remarks">Remarks</label>
                <Controller
                  name="remarks"
                  control={control}
                  rules={{
                    required: "This field is required",
                  }}
                  render={({ field }) => <Input className="mt-2" {...field} />}
                />
                {errors.remarks && (
                  <p className="text-red-500">{errors.remarks.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="mt-3">
              Save Data
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CashDialogue;
