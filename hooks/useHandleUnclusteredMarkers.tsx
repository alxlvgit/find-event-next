import { MutableRefObject, useCallback, useMemo } from "react";
import { MapRef } from "react-map-gl";
import CustomMarker from "@/components/CustomMarker";
import { isEqual } from "lodash";

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
            marker = (
              <CustomMarker
                key={id}
                feature={feature as GeoJSON.Feature<GeoJSON.Point>}
              />
            );
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
  }, [mapRef, markersOnScreenRef, memoizedMarkers, setMarkersOnScreen]);
};
