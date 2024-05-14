import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DailyWorkDataDialogue from "../Dialogues/DailyWorkDataDialogue";
import DailyWorkTable from "../Tables/DailyWorkTable";

const SprayData = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Spray" />
      <DailyWorkDataDialogue />
      <DailyWorkTable sheetName={"SPRAY"} />
    </div>
  );
};

export default SprayData;
