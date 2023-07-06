import React from "react";

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="mx-8 my-6">
      <div className="rounded-md flex flex-col bg-gray-50">{children}</div>
    </li>
  );
};

export default Card;
