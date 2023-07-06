import { IEvent } from "@/interfaces/interfaces";
import getEvents from "@/utils/api";
import {
  applyOffsets as applyOffsets,
  createGeoJsonFromEvents,
  filterDuplicateEvents,
  getRadiusFromBounds,
} from "@/utils/helpers";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useCallback, useRef } from "react";
import { MapRef } from "react-map-gl";

// Handle search button click by fetching events and updating markers
const useHandleSearch = (
  mapRef: MutableRefObject<MapRef>,
  setShowSearchButton: (show: boolean) => void,
  setEvents: (events: IEvent[]) => void,
  setSidebarLoading: (loading: boolean) => void
) => {
  const coordinatesRef: MutableRefObject<Set<string>> = useRef(new Set());
  return useCallback(async () => {
    setShowSearchButton(false);
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const markersSource = map.getSource("events") as mapboxgl.GeoJSONSource;
    const radius = getRadiusFromBounds(map);
    if (!radius || !markersSource) return;
    const { lng, lat } = map.getCenter();
    setSidebarLoading(true);
    const events = await getEvents(
      { longitude: lng, latitude: lat },
      radius,
      ""
    );
    if (!events || !events._embedded) {
      setEvents([]);
      markersSource.setData({ type: "FeatureCollection", features: [] });
    } else {
      const uniqueEvents: IEvent[] = filterDuplicateEvents(
        events._embedded.events
      );
      setEvents(uniqueEvents);
      const geojson = createGeoJsonFromEvents(
        uniqueEvents,
        coordinatesRef.current
      );
      markersSource.setData(geojson);
    }
    setSidebarLoading(false);
  }, [mapRef, setShowSearchButton, setEvents, setSidebarLoading]);
};

export default useHandleSearch;
