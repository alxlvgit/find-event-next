import { IEvent } from "@/interfaces/interfaces";
import getEvents from "@/utils/api";
import {
  createGeoJsonFromEvents,
  filterDuplicateEvents,
  getRadiusFromBounds,
} from "@/utils/helpers";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useCallback, useRef } from "react";
import { MapRef } from "react-map-gl";
import { useAppDispatch } from "@/redux/hooks";
import {
  setEvents,
  setSideBarDataLoading,
} from "@/redux/features/sidebarSlice";

// Handle search button click by fetching events and updating markers
const useHandleSearch = (
  mapRef: MutableRefObject<MapRef>,
  setShowSearchButton: (show: boolean) => void
) => {
  const coordinatesRef: MutableRefObject<Set<string>> = useRef(new Set());
  const dispatch = useAppDispatch();
  return useCallback(async () => {
    setShowSearchButton(false);
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const markersSource = map.getSource("events") as mapboxgl.GeoJSONSource;
    const radius = getRadiusFromBounds(map);
    if (!radius || !markersSource) return;
    const { lng, lat } = map.getCenter();
    dispatch(setSideBarDataLoading(true));
    const events = await getEvents(
      { longitude: lng, latitude: lat },
      radius,
      ""
    );
    if (!events || !events._embedded) {
      dispatch(setEvents([]));
      markersSource.setData({ type: "FeatureCollection", features: [] });
    } else {
      const uniqueEvents: IEvent[] = filterDuplicateEvents(
        events._embedded.events
      );
      dispatch(setEvents(uniqueEvents));
      const geojson = createGeoJsonFromEvents(
        uniqueEvents,
        coordinatesRef.current
      );
      markersSource.setData(geojson);
    }
    dispatch(setSideBarDataLoading(false));
  }, [mapRef, setShowSearchButton, dispatch]);
};

export default useHandleSearch;
