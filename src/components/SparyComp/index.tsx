import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DailyWorkTable from "../Tables/DailyWorkTable";
import MeteorologicalDialogue from "../Dialogues/SprayDialogue";
import OthersTable from "../Tables/OthersTable";

const MeteorologicalData = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Meteorological" />
      <MeteorologicalDialogue />
      <OthersTable sheetName={"METEOROLOGICAL"} />
    </div>
  );
};

export default MeteorologicalData;
