import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DailyWorkData from "@/components/DailyWorkDataComp";

export const metadata: Metadata = {
  title: "Not named yet.",
  description: "No desc yet",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <DailyWorkData />
      </DefaultLayout>
    </>
  );
}
