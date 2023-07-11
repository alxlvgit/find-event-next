import { useCallback } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setEvents,
  setSideBarDataLoading,
} from "@/redux/features/sidebarSlice";
import getEvents from "@/utils/api";
import { filterDuplicateEvents } from "@/utils/helpers";
import { IFetchEventsQueryParams } from "@/interfaces/interfaces";

const useFetchEvents = () => {
  const dispatch = useAppDispatch();

  const fetchEvents = useCallback(
    async (queryParams: IFetchEventsQueryParams) => {
      dispatch(setSideBarDataLoading(true));
      const { latlong, radius } = queryParams;
      try {
        const events = await getEvents(
          { longitude: latlong.longitude, latitude: latlong.latitude },
          radius,
          ""
        );
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
