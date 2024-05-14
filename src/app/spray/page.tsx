"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";

import SprayData from "@/components/SparyComp";

const page = () => {
  // const [headingRows, setHeadingRows] = useState([]);
  return (
    <DefaultLayout>
      <SprayData />
    </DefaultLayout>
  );
};

export default page;
