import React, {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import Map, {
  Layer,
  Source,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { INITIAL_VIEW_STATE } from "@/utils/map-config";
import { ClusterLayer, ClusterCountLayer } from "@/utils/map-layers";
import { useHandleUnclusteredMarkers } from "@/hooks/useHandleUnclusteredMarkers";
import SearchButton from "./SearchButton";
import useHandleSearch from "@/hooks/useHandleSearch";
import { useAppSelector } from "@/redux/hooks";

const MapComponent = () => {
  const mapRef: MutableRefObject<any> = useRef();
  const markersOnScreenRef = useRef({});
  const [showSearchButton, setShowSearchButton] = useState(false);
  const markersOnScreen = useAppSelector(
    (state) => state.mapSlice.markersOnScreen
  );

  // Handle unclustered markers on render event
  const onRender = useHandleUnclusteredMarkers(mapRef, markersOnScreenRef);

  // Show search button on zoomend event
  const onZoomEnd = useCallback(() => {
    setShowSearchButton(true);
  }, [setShowSearchButton]);

  // Handle search button click
  const handleOnSearch = useHandleSearch(mapRef, setShowSearchButton);

  // Add event listeners on map load
  const onLoad = useCallback(() => {
    handleOnSearch();
    mapRef.current?.getMap().on("zoomend", onZoomEnd);
    mapRef.current?.getMap().on("render", onRender);
  }, [mapRef, onRender, onZoomEnd, handleOnSearch]);

  // Create markers from markersOnScreen state and memoize them
  const markers = useMemo(() => {
    if (!markersOnScreen) return;
    return Object.values(markersOnScreenRef.current);
  }, [markersOnScreen]);

  return (
    <div className="flex justify-center flex-grow">
      <Map
        ref={mapRef}
        reuseMaps={true}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        projection={"globe"}
        initialViewState={INITIAL_VIEW_STATE}
        onLoad={onLoad}
      >
        <NavigationControl />
        <GeolocateControl />
        <Source
          id="events"
          type="geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          data={{
            type: "FeatureCollection",
            features: [],
          }}
        >
          <Layer {...ClusterLayer} />
          <Layer {...ClusterCountLayer} />
        </Source>
        {markers}
      </Map>
      {showSearchButton && <SearchButton onClick={handleOnSearch} />}
    </div>
  );
};

export default MapComponent;
