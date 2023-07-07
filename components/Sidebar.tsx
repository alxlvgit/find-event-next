import { IEvent } from "@/interfaces/interfaces";
import React from "react";
import EventCard from "./EventCard";
import SideBarLoadingSkeleton from "./SideBarLoadingSkeleton";
import SideBarNoEventsSkeleton from "./SideBarNoEventsSkeleton";
import { useAppSelector } from "@/redux/hooks";

const Sidebar = () => {
  const events: IEvent[] = useAppSelector((state) => state.sidebarSlice.events);
  const loading: boolean = useAppSelector(
    (state) => state.sidebarSlice.sideBarDataLoading
  );
  return (
    <ul className="w-72 bg-white border-r-2 border-blue-50 flex flex-col overflow-y-auto ">
      {loading ? (
        <SideBarLoadingSkeleton />
      ) : events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <SideBarNoEventsSkeleton />
      )}
    </ul>
  );
};

export default Sidebar;
