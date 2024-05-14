import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DailyWorkData from "@/components/DailyWorkDataComp";
import CashData from "@/components/Cash";

const page = () => {
  return (
    <DefaultLayout>
      <CashData />
    </DefaultLayout>
  );
};

export default page;
