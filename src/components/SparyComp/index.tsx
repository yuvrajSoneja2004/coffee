import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DailyWorkDataDialogue from "../Dialogues/DailyWorkDataDialogue";
import SprayDialogue from "../Dialogues/SprayDialogue";
import DailyWorkTable from "../Tables/DailyWorkTable";

const SprayData = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Spray" />
      <SprayDialogue />
      <DailyWorkTable sheetName={"SPRAY"} />
    </div>
  );
};

export default SprayData;
