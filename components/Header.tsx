import React from "react";
import { Select, Option } from "@material-tailwind/react";
import { useAppDispatch } from "@/redux/hooks";
import { setSelectedClassification } from "@/redux/features/mapSlice";

export const Header = () => {
  const dispatch = useAppDispatch();
  const handleCategoryChange = (value: string | undefined) => {
    dispatch(setSelectedClassification(value as string));
  };

  return (
    <div className="border-b ml-96 border-blue-50 flex p-2 h-fit justify-start">
      <div className="ml-6">
        <Select label="Select Classification" onChange={handleCategoryChange}>
          <Option value="">All</Option>
          <Option value="music">Music</Option>
          <Option value="art">Art & Theatre</Option>
          <Option value="sport">Sport</Option>
        </Select>
      </div>
    </div>
  );
};
