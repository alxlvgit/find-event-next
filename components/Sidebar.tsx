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
import { useMapSidebarVisibility } from "@/hooks/useMapSidebarVisibility";

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

  // Show sidebar if map is not visible on small screens
  const sidebarVisibility = useMapSidebarVisibility(!showMap);

  return (
    <ul
      className={`md:w-96 w-full bg-white border-r-2 border-blue-50 md:flex flex-col overflow-y-auto ${sidebarVisibility}`}
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
