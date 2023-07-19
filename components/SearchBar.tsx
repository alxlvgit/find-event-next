import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearchQuery } from "@/redux/features/sidebarSlice";
import LoadingSkeleton from "./LoadingSkeleton";

const SearchBar = () => {
  const [wordEntered, setWordEntered] = useState("");
  const dispatch = useAppDispatch();
  const [isTyping, setIsTyping] = useState(false);
  let debounceTimeout: MutableRefObject<NodeJS.Timeout | undefined> = useRef();
  const showMap = useAppSelector((state) => state.mapSlice.showMap);
  const fetchDataLoading = useAppSelector(
    (state) => state.sidebarSlice.dataIsLoading
  );

  useEffect(() => {
    const handleSearch = () => {
      clearTimeout(debounceTimeout.current);
      setIsTyping(true);

      debounceTimeout.current = setTimeout(() => {
        dispatch(setSearchQuery(`keyword=${wordEntered}`));
        setIsTyping(false);
      }, 2000);
    };

    if (wordEntered) {
      handleSearch();
    } else {
      setIsTyping(false);
      dispatch(setSearchQuery(""));
    }

    return () => {
      clearTimeout(debounceTimeout.current);
    };
  }, [wordEntered, dispatch, setIsTyping]);

  return (
    <div className="flex items-center mb-4 justify-between md:justify-center md:m-0 md:w-[23rem]">
      <div className="relative mt-1">
        <input
          type="text"
          className="pl-4 pr-14 text-xs xs:text-base py-2 border border-blue-gray-200 rounded-md"
          placeholder="Search by keyword"
          value={wordEntered}
          onChange={(e) => setWordEntered(e.target.value)}
        />
        {isTyping && (
          <LoadingSkeleton className="absolute top-2 xs:top-3 right-3 h-4 w-4 border-t-2 border-b-2 border-blue-300" />
        )}
        {!isTyping && wordEntered && (
          <button
            className="absolute top-2 xs:top-3 right-3 text-blue-500 text-xs xs:text-sm"
            onClick={() => setWordEntered("")}
          >
            Clear
          </button>
        )}
      </div>
      {fetchDataLoading && showMap && !wordEntered && (
        <LoadingSkeleton className="md:hidden h-6 w-6" />
      )}
    </div>
  );
};

export default SearchBar;
