import React from "react";
import { Select, Option } from "@material-tailwind/react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setSelectedClassification,
  setSortSelection,
} from "@/redux/features/mapSlice";
import { ShowMapButton } from "./ShowMapButton";

export const Header = () => {
  const dispatch = useAppDispatch();
  const handleCategoryChange = (value: string | undefined) => {
    value ? dispatch(setSelectedClassification(value)) : null;
  };
  const handleSortChange = (value: string | undefined) => {
    value ? dispatch(setSortSelection(value)) : null;
  };

  return (
    <div className="border-b md:ml-[394px] border-blue-50 flex p-2 justify-evenly items-center md:justify-start">
      <div className="w-28 xs:w-48 mt-1">
        <Select
          label="Classification"
          value=""
          onChange={handleCategoryChange}
          className="text-xs xs:text-sm"
          containerProps={{
            className: "min-w-full",
          }}
        >
          <Option value="">All</Option>
          <Option value="music">Music</Option>
          <Option value="art">Art & Theatre</Option>
          <Option value="sport">Sport</Option>
        </Select>
      </div>
      <div className="md:ml-6 w-28 xs:w-48 mt-1">
        <Select
          label="Sort By"
          value="relevance,desc"
          onChange={handleSortChange}
          className="text-xs xs:text-sm"
          containerProps={{
            className: "min-w-full",
          }}
        >
          <Option value="relevance,desc">Relevance</Option>
          <Option value="date,asc">Date</Option>
          <Option value="name,asc">Name</Option>
          <Option value="random">Random</Option>
        </Select>
      </div>
      <ShowMapButton />
    </div>
  );
};
