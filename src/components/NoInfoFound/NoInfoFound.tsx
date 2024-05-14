import React from "react";

function NoInfoFound() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center">
      <img src="./images/no-data.png" alt="no-data" className="h-44 w-44" />
      <h1 className="text-[25px]">No Data Found.</h1>
    </div>
  );
}

export default NoInfoFound;
