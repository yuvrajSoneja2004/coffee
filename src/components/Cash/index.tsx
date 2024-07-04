import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import CashDialogue from "../Dialogues/CashDialogue";
import OthersTable from "../Tables/OthersTable";

const CashData = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Cash" />
      <CashDialogue />
      <OthersTable sheetName={"CASH"} />
    </div>
  );
};

export default CashData;
