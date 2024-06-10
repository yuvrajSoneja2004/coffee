import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import CashDialogue from "../Dialogues/CashDialogue";
import DailyWorkDataDialogue from "../Dialogues/DailyWorkDataDialogue";
import DailyWorkTable from "../Tables/DailyWorkTable";
import { Button } from "../ui/button";

const CashData = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Cash" />
      <CashDialogue />
      <DailyWorkTable sheetName={"CASH"} />
    </div>
  );
};

export default CashData;
