import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DailyWorkDataDialogue from "../Dialogues/DailyWorkDataDialogue";
import DailyWorkTable from "../Tables/DailyWorkTable";
import { Button } from "../ui/button";

const DailyWorkData = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Daily Work Data" />
      <DailyWorkDataDialogue />
      <DailyWorkTable />
    </div>
  );
};

export default DailyWorkData;
