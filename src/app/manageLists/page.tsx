import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ManageLists from "@/components/ManageLists/ManageLists";
import React from "react";

function page() {
  return (
    <DefaultLayout>
      <ManageLists />
    </DefaultLayout>
  );
}

export default page;
