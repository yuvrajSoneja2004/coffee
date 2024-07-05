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
import { useAppSelector } from "@/redux/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { handleReload } from "@/redux/features/authSlice";
import { formatDate } from "@/lib/formatDate";

function CashDialogue() {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const { slNoStarts } = useAppSelector((state) => state.authSlice);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const handleSave = () => {
    // Construct your payload with the state values
    const payload = {
      slNo: slNoStarts,
      date: formatDate(),
      expense,
      amount,
      remarks,
    };

    // Send HTTP request to the server
    fetch("/api/saveCash", {
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
                <Input className="mt-2" value={slNoStarts} />
              </div>
              <div>
                <label htmlFor="Date">Date</label>
                <Input className="mt-2" value={formatDate(new Date())} />
              </div>
              {/* Expense  */}
              <div className="mt-2">
                <label htmlFor="Date">Expense</label>
                <Input
                  className="mt-2"
                  value={expense}
                  onChange={(e) => setExpense(e.target.value)}
                />
              </div>
              {/* Amount  */}
              <div className="mt-2">
                <label htmlFor="Date">Amount</label>
                <Input
                  className="mt-2"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {/* Remarks  */}
              <div className="mt-2">
                <label htmlFor="Date">Remarks</label>
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

export default CashDialogue;
