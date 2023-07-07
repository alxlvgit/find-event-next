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

const MapComponent = () => {
  const mapRef: MutableRefObject<any> = useRef();
  const [markersOnScreen, setMarkersOnScreen] = useState({});
  const markersOnScreenRef = useRef({});
  const [showSearchButton, setShowSearchButton] = useState(false);

  // Handle unclustered markers on render event
  const onRender = useHandleUnclusteredMarkers(
    mapRef,
    setMarkersOnScreen,
    markersOnScreenRef
  );

  // Show search button on zoomend event
  const onZoomEnd = useCallback(() => {
    setShowSearchButton(true);
  }, [setShowSearchButton]);

  // Add event listeners on map load
  const onLoad = useCallback(() => {
    mapRef.current?.getMap().on("zoomend", onZoomEnd);
    mapRef.current?.getMap().on("render", onRender);
  }, [mapRef, onRender, onZoomEnd]);

  // Handle search button click
  const handleOnSearch = useHandleSearch(mapRef, setShowSearchButton);

  // Create markers from markersOnScreen state and memoize them
  const markers = useMemo(() => {
    return Object.values(markersOnScreen);
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
