import React from "react";
import { Select, Option } from "@material-tailwind/react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setSelectedClassification,
  setSortSelection,
} from "@/redux/features/mapSlice";

export const Header = () => {
  const dispatch = useAppDispatch();
  const handleCategoryChange = (value: string | undefined) => {
    value ? dispatch(setSelectedClassification(value)) : null;
  };
  const handleSortChange = (value: string | undefined) => {
    value ? dispatch(setSortSelection(value)) : null;
  };

  return (
    <div className="border-b md:ml-96 border-blue-50 flex p-2 justify-start">
      <div className="ml-6">
        <Select
          label="Select Classification"
          value=""
          onChange={handleCategoryChange}
        >
          <Option value="">All</Option>
          <Option value="music">Music</Option>
          <Option value="art">Art & Theatre</Option>
          <Option value="sport">Sport</Option>
        </Select>
      </div>
      <div className="ml-6">
        <Select
          label="Sort By"
          value="relevance,desc"
          onChange={handleSortChange}
        >
          <Option value="relevance,desc">Relevance</Option>
          <Option value="date,asc">Date</Option>
          <Option value="name,asc">Name</Option>
          <Option value="random">Random</Option>
        </Select>
      </div>
    </div>
  );
};
