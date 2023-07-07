"use client";

import React, { useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "@/components/Sidebar";
import MapComponent from "@/components/MapComponent";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* <div className="flex justify-center bg-white border-b-2 border-blue-50">
        <button className="bg-blue-50 rounded-md px-8 py-2 m-1">Test</button>
      </div> */}
      <div className="flex flex-grow overflow-y-auto">
        <Sidebar />
        <div className="flex justify-center flex-grow">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
