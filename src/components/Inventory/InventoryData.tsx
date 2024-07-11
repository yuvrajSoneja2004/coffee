import React from "react";
import InventoryDialogue from "../Dialogues/InventoryDialogue";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DailyWorkTable from "../Tables/DailyWorkTable";
import OthersTable from "../Tables/OthersTable";
import FilterDropdown, { ComboboxDemo } from "../FilterDropdown/FilterDropdown";

function InventoryData() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl">
      <div className="w-3/4 pr-4">
        <Breadcrumb pageName="Inventory" />
        <InventoryDialogue />
        <OthersTable sheetName={"INVENTORY"} />
      </div>
      {/* Filter */}
      <FilterDropdown />
    </div>
  );
}

export default InventoryData;
