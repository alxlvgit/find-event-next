import React from "react";

const SearchButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="absolute top-14 px-3 py-1 shadow-lg bg-white border-[#878d26] border text-black rounded-full z-50 text-sm"
      onClick={onClick}
    >
      Search In This Area
    </button>
  );
};
export default SearchButton;
