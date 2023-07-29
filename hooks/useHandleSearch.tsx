import { setShowSearchButton } from "@/redux/features/mapSlice";
import { useAppDispatch } from "@/redux/hooks";
import { createGeoJsonFromEvents, getRadiusFromBounds } from "@/utils/helpers";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useCallback, useRef } from "react";
import { MapRef } from "react-map-gl";
import useFetchEvents from "./useFetchEvents";

// Handle search button click by fetching events and updating markers
const useHandleSearch = (
  mapRef: MutableRefObject<MapRef>,
  classification: string,
  sortBy: string,
  searchBarQuery: string
) => {
  const coordinatesRef: MutableRefObject<Set<string>> = useRef(new Set());
  const fetchEvents = useFetchEvents();
  const dispatch = useAppDispatch();
  return useCallback(async () => {
    dispatch(setShowSearchButton(false));
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const markersSource = map.getSource("events") as mapboxgl.GeoJSONSource;
    const radius = getRadiusFromBounds(map);
    if (radius === null || !markersSource) return;
    const { lng, lat } = map.getCenter();
    const events = await fetchEvents({
      latitude: lat,
      longitude: lng,
      radius,
      classification,
      sortBy,
      searchBarQuery,
    });
    const geojson = createGeoJsonFromEvents(events, coordinatesRef.current);
    markersSource.setData(geojson);
  }, [mapRef, classification, sortBy, searchBarQuery, fetchEvents, dispatch]);
};

export default useHandleSearch;
