import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DailyWorkTable from "../Tables/DailyWorkTable";
import MeteorologicalDialogue from "../Dialogues/SprayDialogue";

const MeteorologicalData = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Meteorological" />
      <MeteorologicalDialogue />
      <DailyWorkTable sheetName={"METEOROLOGICAL"} />
    </div>
  );
};

export default MeteorologicalData;
