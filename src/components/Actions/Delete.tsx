"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { useToast } from "../ui/use-toast";

function Delete({ rowIndex, isAllowed, sheetName }: any) {
  const { toast } = useToast();
  const [open, setIsOpen] = useState(false);
  const handleDelete = async () => {
    try {
      const { data } = axios.put("/api/googletest", {
        sheetName: sheetName,
        rowIndex: rowIndex + 2,
      });

      setIsOpen(false);

      toast({
        title: "Deleted successfully",
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open}>
      <DialogTrigger>
        <button
          className="flex items-center justify-center rounded-md bg-red-500 p-1.5"
          disabled={!isAllowed}
          style={{ opacity: !isAllowed ? 0.5 : 1 }}
          onClick={() => setIsOpen(true)}
        >
          <Trash2 size={13} color="#fff" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-3">Are you absolutely sure?</DialogTitle>
          <DialogDescription className="mb-4">
            Do you want to delete this row?
          </DialogDescription>
          <div className="mt-4 flex flex-row gap-2">
            <Button onClick={handleDelete}>YES</Button>
            <Button onClick={() => setIsOpen(false)}>NO</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default Delete;
