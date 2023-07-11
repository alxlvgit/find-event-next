import { IEvent } from "@/interfaces/interfaces";
import {
  setHasMoreEvents,
  setVisibleEvents,
} from "@/redux/features/sidebarSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useCallback, useRef } from "react";

const useInfiniteScroll = (events: IEvent[], loading: boolean) => {
  const hasMoreEvents = useAppSelector(
    (state) => state.sidebarSlice.hasMoreEvents
  );
  const visibleEvents = useAppSelector(
    (state) => state.sidebarSlice.visibleEvents
  );
  const observer = useRef<IntersectionObserver | null>(null);
  const dispatch = useAppDispatch();

  // Render 7 new event cards when user scrolls past the last rendered card in the sidebar
  const handleVisibleEvents = useCallback(
    (events: IEvent[]) => {
      const remainingEvents = events.slice(visibleEvents.length);
      const newEvents = remainingEvents.slice(0, 7);
      dispatch(setVisibleEvents([...visibleEvents, ...newEvents]));
      dispatch(setHasMoreEvents(newEvents.length > 0));
    },
    [visibleEvents, dispatch]
  );

  // Set up the intersection observer to handle infinite scrolling
  return useCallback(
    (node: HTMLLIElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreEvents) {
          handleVisibleEvents(events);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMoreEvents, events, handleVisibleEvents]
  );
};

export default useInfiniteScroll;
