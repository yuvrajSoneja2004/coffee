import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DailyWorkTable() {
  return (
    <Table className="mt-6">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow className="text-sm">
          <TableHead className="w-[100px]">SL-No</TableHead>
          <TableHead className="text-[14px]">Date</TableHead>
          <TableHead className="text-[14px]">Type of Work</TableHead>
          <TableHead className="text-[14px]">Details of work done</TableHead>
          <TableHead>TreeList</TableHead>
          <TableHead>Male Labour count</TableHead>
          <TableHead>Female Labour count</TableHead>
          <TableHead>Male Labour count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="">$250.00</TableCell>
          <TableCell className="">$250.00</TableCell>
          <TableCell className="">$250.00</TableCell>
          <TableCell className="">$250.00</TableCell>
          <TableCell className="">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default DailyWorkTable;
