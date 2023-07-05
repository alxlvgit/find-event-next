import getEvents from "@/utils/api";
import { createGeoJsonFromEvents } from "@/utils/helpers";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useCallback, useRef, useState } from "react";
import { MapRef } from "react-map-gl";

const useHandleSearch = (
  mapRef: MutableRefObject<MapRef>,
  setShowSearchButton: (show: boolean) => void
) => {
  return useCallback(async () => {
    if (!mapRef.current) return;
    setShowSearchButton(false);
    const mapCenter = mapRef.current.getMap().getCenter();
    const { lng, lat } = mapCenter;
    const events = await getEvents({ longitude: lng, latitude: lat }, "");
    if (!events || !events._embedded) return;
    const geojson = createGeoJsonFromEvents(events._embedded.events);
    const markersSource = mapRef.current
      ?.getMap()
      .getSource("events") as mapboxgl.GeoJSONSource;
    if (markersSource) markersSource.setData(geojson);
  }, [mapRef, setShowSearchButton]);
};

export default useHandleSearch;
