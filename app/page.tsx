"use client";

import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "@/components/Sidebar";
import MapComponent from "@/components/MapComponent";
import { Header } from "@/components/Header";

const HomePage = () => {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
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
