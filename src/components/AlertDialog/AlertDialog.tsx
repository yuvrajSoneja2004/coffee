import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Props {
  alertHeading: string;
  alertMessage: string;
  isOpen: boolean;
}

function AlertDialoge({ alertHeading, alertMessage, isOpen }: Props) {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <AlertDialog open={isOpen} onClose={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertHeading}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction autoFocus onClick={onClose}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertDialoge;
