"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import DailyWorkData from "@/components/DailyWorkDataComp";

const CalendarPage = () => {
  // const [headingRows, setHeadingRows] = useState([]);
  return (
    <DefaultLayout>
      <DailyWorkData />
    </DefaultLayout>
  );
};

export default CalendarPage;
