import React from "react";
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

function Delete({ rowIndex, isAllowed }: any) {
  const handleDelete = async () => {
    try {
      const { data } = axios.put("/api/googletest", {
        sheetName: "DAILY WORK DATA",
        rowIndex: rowIndex + 2,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <button
          className="flex items-center justify-center rounded-md bg-red-500 p-1.5"
          disabled={!isAllowed}
          style={{ opacity: !isAllowed ? 0.5 : 1 }}
        >
          <Trash2 size={13} color="#fff" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <Button onClick={handleDelete}>YES</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default Delete;
