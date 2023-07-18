import { createGeoJsonFromEvents, getRadiusFromBounds } from "@/utils/helpers";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useCallback, useRef } from "react";
import { MapRef } from "react-map-gl";
import useFetchEvents from "./useFetchEvents";

// Handle search button click by fetching events and updating markers
const useHandleSearch = (
  mapRef: MutableRefObject<MapRef>,
  setShowSearchButton: (show: boolean) => void,
  classification: string,
  sortBy: string
) => {
  const coordinatesRef: MutableRefObject<Set<string>> = useRef(new Set());
  const fetchEvents = useFetchEvents();
  return useCallback(async () => {
    setShowSearchButton(false);
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const markersSource = map.getSource("events") as mapboxgl.GeoJSONSource;
    const radius = getRadiusFromBounds(map);
    if (!radius || !markersSource) return;
    const { lng, lat } = map.getCenter();
    const events = await fetchEvents({
      latitude: lat,
      longitude: lng,
      radius,
      classification,
      sortBy,
    });
    const geojson = createGeoJsonFromEvents(events, coordinatesRef.current);
    markersSource.setData(geojson);
  }, [mapRef, setShowSearchButton, fetchEvents, classification, sortBy]);
};

export default useHandleSearch;
