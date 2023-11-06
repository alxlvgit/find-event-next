"use client";

import React from "react";
import { Select, Option } from "@material-tailwind/react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setSelectedClassification,
  setSortSelection,
} from "@/redux/features/mapSlice";
import { ShowMapButton } from "./ShowMapButton";
import SearchBar from "./SearchBar";

export const Header = () => {
  const dispatch = useAppDispatch();
  const handleClassificationChange = (value: string | undefined) => {
    value ? dispatch(setSelectedClassification(value)) : null;
  };
  const handleSortChange = (value: string | undefined) => {
    value ? dispatch(setSortSelection(value)) : null;
  };

  return (
    <div className="w-full flex flex-col py-3 px-4 border-blue-50 border-b justify-evenly md:flex-row md:justify-normal ">
      <SearchBar />
      <div className="flex items-center md:justify-start">
        <div className="w-28 mt-1 mr-2 md:mr-0 xs:w-48">
          <Select
            label="Classification"
            value="all"
            onChange={handleClassificationChange}
            className="text-xs xs:text-sm"
            containerProps={{
              className: "min-w-full",
            }}
          >
            <Option className="text-xs xs:text-sm px-2 xs:px-3" value="all">
              All
            </Option>
            <Option className="text-xs xs:text-sm px-2 xs:px-3" value="music">
              Music
            </Option>
            <Option className="text-xs xs:text-sm px-2 xs:px-3" value="art">
              Art & Theatre
            </Option>
            <Option className="text-xs xs:text-sm px-2 xs:px-3" value="sport">
              Sport
            </Option>
          </Select>
        </div>
        <div className="md:ml-6 w-24 xs:w-48 mt-1">
          <Select
            label="Sort By"
            value="random"
            onChange={handleSortChange}
            className="text-xs xs:text-sm"
            containerProps={{
              className: "min-w-full",
            }}
          >
            <Option className="text-xs xs:text-sm px-2 xs:px-3" value="random">
              Random
            </Option>
            <Option
              className="text-xs xs:text-sm px-2 xs:px-3"
              value="relevance,desc"
            >
              Relevance
            </Option>
            <Option
              className="text-xs xs:text-sm px-2 xs:px-3"
              value="date,asc"
            >
              Date
            </Option>
            <Option
              className="text-xs xs:text-sm px-2 xs:px-3"
              value="name,asc"
            >
              Name
            </Option>
          </Select>
        </div>
        <ShowMapButton />
      </div>
    </div>
  );
};
