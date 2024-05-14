import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

function Edit() {
  return (
    <Dialog>
      <DialogTrigger>
        <button className="flex items-center justify-center rounded-md bg-green-500 p-1.5">
          <Pencil size={13} color="#fff" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default Edit;
