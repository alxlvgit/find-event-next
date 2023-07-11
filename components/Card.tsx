import React from "react";

const Card = ({
  children,
  lastCardRef: lastCardRef,
}: {
  children: React.ReactNode;
  lastCardRef?: (node: HTMLLIElement) => void;
}) => {
  return (
    <li ref={lastCardRef} className="mx-8 my-6">
      <div className="rounded-md flex flex-col bg-gray-50">{children}</div>
    </li>
  );
};

export default Card;
