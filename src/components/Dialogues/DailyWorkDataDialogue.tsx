import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

function DailyWorkDataDialogue() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="flex-center flex gap-2">
          <Plus />
          Add Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DailyWorkDataDialogue;
