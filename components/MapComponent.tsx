import React, {
  MutableRefObject,
  useCallback,
  useEffect,
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
import { useMapSidebarVisibility } from "@/hooks/useMapSidebarVisibility";
import SearchButton from "./SearchButton";
import useHandleSearch from "@/hooks/useHandleSearch";
import { useAppSelector } from "@/redux/hooks";

const MapComponent = () => {
  const mapRef: MutableRefObject<any> = useRef();
  const markersOnScreenRef = useRef({});
  const [showSearchButton, setShowSearchButton] = useState(false);
  const { markersOnScreen, selectedClassification, sortSelection, showMap } =
    useAppSelector((state) => state.mapSlice);

  // Handle search button click
  const handleOnSearch = useHandleSearch(
    mapRef,
    setShowSearchButton,
    selectedClassification,
    sortSelection
  );

  // Fetch events on classification change
  useEffect(() => {
    if (!mapRef.current) return;
    handleOnSearch();
  }, [handleOnSearch, selectedClassification, sortSelection]);

  // Handle unclustered markers on render event
  const onRender = useHandleUnclusteredMarkers(mapRef, markersOnScreenRef);

  // Show search button on zoomend event
  const onZoomEnd = useCallback(() => {
    setShowSearchButton(true);
  }, [setShowSearchButton]);

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

  // Show sidebar if map is not visible on small screens
  const mapVisibility = useMapSidebarVisibility(showMap);

  return (
    <div className={`justify-center flex-grow md:flex ${mapVisibility}`}>
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
