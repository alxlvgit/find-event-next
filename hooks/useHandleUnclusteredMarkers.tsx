import { MutableRefObject, useCallback, useMemo, useRef } from "react";
import {
  GeoJSONSource,
  LngLat,
  LngLatLike,
  MapboxGeoJSONFeature,
  MapRef,
  Point,
  PointLike,
} from "react-map-gl";
import CustomMarker from "@/components/CustomMarker";
import { isEqual } from "lodash";
import { applyOffset } from "@/utils/helpers";

// Handle unclustered markers by adding them to the markersOnScreen state and memoizing previously rendered markers
export const useHandleUnclusteredMarkers = (
  mapRef: MutableRefObject<MapRef | undefined>,
  setMarkersOnScreen: (markers: { [key: string]: JSX.Element }) => void,
  markersOnScreenRef: MutableRefObject<{ [key: string]: JSX.Element }>
) => {
  const memoizedMarkers: { [key: string]: JSX.Element } = useMemo(
    () => ({}),
    []
  );
  const coordinatesRef: MutableRefObject<Set<string>> = useRef(new Set());

  return useCallback(() => {
    if (!mapRef.current) return;
    const newMarkers: { [key: string]: JSX.Element } = {};
    const markersSource = mapRef.current.getMap().getSource("events");
    if (markersSource) {
      const features = mapRef.current?.getMap().querySourceFeatures("events");
      for (const feature of features) {
        if (!feature.properties!.cluster) {
          const id = feature.properties!.id;
          let marker = memoizedMarkers[id];
          if (!marker) {
            const [lngInitial, latInitial] = (feature.geometry as GeoJSON.Point)
              .coordinates;
            const { longitude, latitude } = applyOffset(
              coordinatesRef,
              lngInitial,
              latInitial
            );
            const updatedFeature: GeoJSON.Feature<GeoJSON.Point> = {
              ...feature,
              geometry: { type: "Point", coordinates: [longitude, latitude] },
            };
            marker = <CustomMarker key={id} feature={updatedFeature} />;
            memoizedMarkers[id] = marker;
          }
          newMarkers[id] = marker;
        }
      }
      // Update markersOnScreen state only if new markers are different from the previous ones
      if (isEqual(newMarkers, markersOnScreenRef.current)) return;
      setMarkersOnScreen(newMarkers);
      markersOnScreenRef.current = newMarkers;
    }
  }, [
    mapRef,
    markersOnScreenRef,
    memoizedMarkers,
    setMarkersOnScreen,
    coordinatesRef,
  ]);
};
