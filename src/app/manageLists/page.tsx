import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ManageLists from "@/components/ManageLists/ManageLists";
import ManageListsA from "@/components/ManageLists/ManageListsA";
import React from "react";

function page() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Lists & Options" />
      <h1 className="mb-5 text-3xl">List #1</h1>
      <ManageListsA />
      <h1 className="my-5 text-3xl">List #2</h1>
      <ManageLists />
    </DefaultLayout>
  );
}

export default page;
