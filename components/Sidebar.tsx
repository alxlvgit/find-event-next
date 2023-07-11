import { IEvent } from "@/interfaces/interfaces";
import React, { useEffect } from "react";
import EventCard from "./EventCard";
import SideBarLoadingSkeleton from "./SideBarLoadingSkeleton";
import SideBarNoEventsSkeleton from "./SideBarNoEventsSkeleton";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import useInfiniteScroll from "@/hooks/useInfiniteScrolling";
import {
  setVisibleEvents,
  setHasMoreEvents,
} from "@/redux/features/sidebarSlice";

const Sidebar = () => {
  const events: IEvent[] = useAppSelector((state) => state.sidebarSlice.events);
  const loading: boolean = useAppSelector(
    (state) => state.sidebarSlice.sideBarDataLoading
  );
  const visibleEvents = useAppSelector(
    (state) => state.sidebarSlice.visibleEvents
  );
  const dispatch = useAppDispatch();

  // Render initial 10 events
  useEffect(() => {
    const initialEvents = events.slice(0, 10);
    dispatch(setVisibleEvents(initialEvents));
    dispatch(setHasMoreEvents(initialEvents.length > 0));
  }, [events, dispatch]);

  // Handle infinite scrolling if user scrolls past the last rendered card in the sidebar
  const lastVisibleCardRef = useInfiniteScroll(events, loading);

  return (
    <ul className="w-72 bg-white border-r-2 border-blue-50 flex flex-col overflow-y-auto ">
      {loading ? (
        <SideBarLoadingSkeleton />
      ) : visibleEvents.length > 0 ? (
        visibleEvents.map((event, index) => {
          if (visibleEvents.length === index + 1) {
            return (
              <EventCard
                key={event.id}
                event={event}
                lastCardRef={lastVisibleCardRef}
              />
            );
          } else {
            return <EventCard key={event.id} event={event} />;
          }
        })
      ) : (
        <SideBarNoEventsSkeleton />
      )}
    </ul>
  );
};

export default Sidebar;
