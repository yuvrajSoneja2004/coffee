import DailyWorkData from "@/components/DailyWorkDataComp";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

function page() {
  return (
    <DefaultLayout>
      <DailyWorkData />
    </DefaultLayout>
  );
}

export default page;
