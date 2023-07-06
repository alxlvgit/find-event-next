import React from "react";

const SideBarNoEventsSkeleton = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <p className="text-gray-500 text-xl w-3/4 text-center">
        No events found. Try searching in different area.
      </p>
    </div>
  );
};

export default SideBarNoEventsSkeleton;
