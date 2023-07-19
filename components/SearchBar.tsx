import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setSearchQuery } from "@/redux/features/sidebarSlice";

const SearchBar = () => {
  const [wordEntered, setWordEntered] = useState("");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  let debounceTimeout: MutableRefObject<NodeJS.Timeout | undefined> = useRef();

  useEffect(() => {
    const handleSearch = () => {
      clearTimeout(debounceTimeout.current);
      setIsLoading(true);

      debounceTimeout.current = setTimeout(() => {
        dispatch(setSearchQuery(`keyword=${wordEntered}`));
        setIsLoading(false);
      }, 2000);
    };

    if (wordEntered) {
      handleSearch();
    } else {
      setIsLoading(false);
      dispatch(setSearchQuery(""));
    }

    return () => {
      clearTimeout(debounceTimeout.current);
    };
  }, [wordEntered, dispatch, setIsLoading]);

  return (
    <div className="flex items-center mb-4 justify-start md:justify-center md:m-0 md:w-[23rem]">
      <div className="relative mt-1">
        <input
          type="text"
          className="pl-4 pr-14 text-xs xs:text-base py-2 border border-blue-gray-200 rounded-md"
          placeholder="Search by keyword"
          value={wordEntered}
          onChange={(e) => setWordEntered(e.target.value)}
        />
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 absolute top-2 xs:top-3 right-3 border-t-2 border-b-2 border-blue-300"></div>
        )}
        {!isLoading && wordEntered && (
          <button
            className="absolute top-2 xs:top-3 right-3 text-blue-500 text-xs xs:text-sm"
            onClick={() => setWordEntered("")}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
