"use client";

import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setShowSearchButton } from "@/redux/features/mapSlice";

const MapComponent = () => {
  const mapRef: MutableRefObject<any> = useRef();
  const markersOnScreenRef = useRef({});
  const dispatch = useAppDispatch();
  const {
    markersOnScreen,
    selectedClassification,
    sortSelection,
    showMap,
    showSearchButton,
  } = useAppSelector((state) => state.mapSlice);
  const searchBarQuery = useAppSelector(
    (state) => state.sidebarSlice.searchBarQuery
  );

  // Handle search button click
  const handleOnSearch = useHandleSearch(
    mapRef,
    selectedClassification,
    sortSelection,
    searchBarQuery
  );

  // Fetch events on classification change
  useEffect(() => {
    if (!mapRef.current) return;
    handleOnSearch();
  }, [handleOnSearch, selectedClassification, sortSelection, searchBarQuery]);

  // Handle unclustered markers on render event
  const onRender = useHandleUnclusteredMarkers(mapRef, markersOnScreenRef);

  // Show search button on zoomend event
  const onZoomEnd = useCallback(() => {
    dispatch(setShowSearchButton(true));
  }, [dispatch]);

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

  // Resize map on map visibility change
  useEffect(() => {
    if (showMap) {
      mapRef.current?.getMap().resize();
    }
  }, [showMap]);

  return (
    <div
      className={`relative ${
        showMap ? "flex" : "hidden"
      } justify-center flex-grow md:flex`}
    >
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
      {showSearchButton && !searchBarQuery && (
        <SearchButton onClick={handleOnSearch} />
      )}
    </div>
  );
};

export default MapComponent;
