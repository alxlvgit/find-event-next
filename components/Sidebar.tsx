import React from "react";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul className="w-72 bg-white border-r-2 border-blue-50 flex flex-col overflow-y-auto ">
      {children}
    </ul>
  );
};

export default Sidebar;
