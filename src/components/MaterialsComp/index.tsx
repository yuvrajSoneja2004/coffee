import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DailyWorkDataDialogue from "../Dialogues/DailyWorkDataDialogue";
import MaterialDialogue from "../Dialogues/MaterialDialoges";
import DailyWorkTable from "../Tables/DailyWorkTable";
import { Button } from "../ui/button";

const MaterialsData = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Material" />
      <MaterialDialogue />
      <DailyWorkTable sheetName={"MATERIAL"} />
    </div>
  );
};

export default MaterialsData;
