import React from "react";

const Card = ({
  children,
  lastCardRef: lastCardRef,
}: {
  children: React.ReactNode;
  lastCardRef?: (node: HTMLLIElement) => void;
}) => {
  return (
    <li
      ref={lastCardRef}
      className="mx-6 my-8 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 hover:opacity-70 transition duration-300 ease-in-out "
    >
      <div className="flex flex-col relative">{children}</div>
    </li>
  );
};

export default Card;
