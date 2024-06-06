import InventoryData from "@/components/Inventory/InventoryData";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

function page() {
  return (
    <DefaultLayout>
      <InventoryData />
    </DefaultLayout>
  );
}

export default page;
