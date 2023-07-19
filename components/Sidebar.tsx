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
  const showMap = useAppSelector((state) => state.mapSlice.showMap);
  const dispatch = useAppDispatch();

  // Render initial 10 events
  useEffect(() => {
    const initialEvents = events.slice(0, 5);
    dispatch(setVisibleEvents(initialEvents));
    dispatch(setHasMoreEvents(events.length > 10));
  }, [events, dispatch]);

  // Handle infinite scrolling if user scrolls past the last rendered card in the sidebar
  const lastVisibleCardRef = useInfiniteScroll(events, loading);

  return (
    <ul
      className={`md:w-[24rem] w-full bg-white border-r-2 md:block border-blue-50 overflow-y-auto ${
        showMap ? "hidden" : "block"
      }`}
    >
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
