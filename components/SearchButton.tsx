import React from "react";

const SearchButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="absolute top-6 px-3 py-1 shadow-lg bg-white border-[#437bca] border text-black rounded-full z-50 xs:text-sm text-xs"
      onClick={onClick}
    >
      Search In This Area
    </button>
  );
};
export default SearchButton;
