import React from "react";

const SideBarLoadingSkeleton = () => {
  return (
    <div className="flex justify-center items-center h-full flex-grow">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-300"></div>
    </div>
  );
};

export default SideBarLoadingSkeleton;
