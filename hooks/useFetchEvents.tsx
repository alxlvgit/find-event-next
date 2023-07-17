import { useCallback } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setEvents,
  setSideBarDataLoading,
} from "@/redux/features/sidebarSlice";
import { filterDuplicateEvents } from "@/utils/helpers";
import { IFetchEventsQueryParams } from "@/interfaces/interfaces";

const useFetchEvents = () => {
  const dispatch = useAppDispatch();

  const fetchEvents = useCallback(
    async (queryParams: IFetchEventsQueryParams) => {
      dispatch(setSideBarDataLoading(true));
      const { latitude, longitude, radius, classification } = queryParams;
      const TICKETMASTER_API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
      const locationQuery = `latlong=${latitude},${longitude}&unit=km&radius=${radius}`;
      const querySearchParam = classification
        ? `&classificationName=${classification}`
        : "";

      try {
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&${locationQuery}&sort=date,asc&size=200${querySearchParam}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        const events = await res.json();

        if (!events || !events._embedded) {
          dispatch(setEvents([]));
          return [];
        }
        const uniqueEvents = filterDuplicateEvents(events._embedded.events);
        dispatch(setEvents(uniqueEvents));
        return uniqueEvents;
      } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
      } finally {
        dispatch(setSideBarDataLoading(false));
      }
    },
    [dispatch]
  );

  return fetchEvents;
};

export default useFetchEvents;
