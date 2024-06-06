import React from "react";
import InventoryDialogue from "../Dialogues/InventoryDialogue";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DailyWorkTable from "../Tables/DailyWorkTable";

function InventoryData() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Inventory" />
      <InventoryDialogue />
      <DailyWorkTable sheetName={"INVENTORY"} />
    </div>
  );
}

export default InventoryData;
