"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";

import MeteorologicalData from "@/components/SparyComp";

const page = () => {
  // const [headingRows, setHeadingRows] = useState([]);
  return (
    <DefaultLayout>
      <MeteorologicalData />
    </DefaultLayout>
  );
};

export default page;
