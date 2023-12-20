import { useCallback, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setEvents,
  setSideBarDataLoading,
} from "@/redux/features/sidebarSlice";
import { IFetchEventsQueryParams } from "@/interfaces/interfaces";

const useFetchEvents = () => {
  const dispatch = useAppDispatch();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchEvents = useCallback(
    async (queryParams: IFetchEventsQueryParams) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      dispatch(setSideBarDataLoading(true));
      const {
        latitude,
        longitude,
        radius,
        classification,
        sortBy,
        searchBarQuery,
      } = queryParams;
      const TICKETMASTER_API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
      const locationQuery = `latlong=${latitude},${longitude}&unit=km&radius=${radius}`;
      const size = 100;
      const classificationSearchParam =
        classification !== "all" ? `&classificationName=${classification}` : "";
      try {
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&${
            searchBarQuery ? searchBarQuery : locationQuery
          }&sort=${sortBy}&size=${size}${classificationSearchParam}`,
          {
            signal: abortController.signal,
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        const events = await res.json();

        if (!events || !events._embedded) {
          dispatch(setEvents([]));
          return [];
        }
        dispatch(setEvents(events._embedded.events));
        return events._embedded.events;
      } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
      } finally {
        dispatch(setSideBarDataLoading(false));
      }
    },
    [dispatch, abortControllerRef]
  );

  return fetchEvents;
};

export default useFetchEvents;
