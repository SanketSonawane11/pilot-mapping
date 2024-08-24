import React from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Components/Map"), { ssr: false });

function page() {
  return (
    <div>
      <Map />
    </div>
  );
}

export default page;
