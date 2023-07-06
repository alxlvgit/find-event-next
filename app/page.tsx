"use client";

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
import useHandleSearch from "@/hooks/useHandleSearch";
import SearchButton from "@/components/SearchButton";
import Sidebar from "@/components/Sidebar";
import { IEvent } from "@/interfaces/interfaces";
import EventCard from "@/components/EventCard";
import SideBarSkeleton from "@/components/SideBarLoadingSkeleton";
import SideBarNoEventsSkeleton from "@/components/SideBarNoEventsSkeleton";

const HomePage = () => {
  const eventsMap: MutableRefObject<any> = useRef();
  const [markersOnScreen, setMarkersOnScreen] = useState({});
  const markersOnScreenRef = useRef(markersOnScreen);
  const [showButton, setShowButton] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);

  // Handle unclustered markers on render event
  const onRender = useHandleUnclusteredMarkers(
    eventsMap,
    setMarkersOnScreen,
    markersOnScreenRef
  );

  // Show search button on zoomend event
  const onZoomEnd = useCallback(() => {
    setShowButton(true);
  }, []);

  // Handle search button click
  const handleOnSearch = useHandleSearch(
    eventsMap,
    setShowButton,
    setEvents,
    setSidebarLoading
  );

  // Add event listeners on map load
  const onLoad = useCallback(() => {
    eventsMap.current?.getMap().on("zoomend", onZoomEnd);
    eventsMap.current?.getMap().on("render", onRender);
  }, [eventsMap, onRender, onZoomEnd]);

  // Create markers from markersOnScreen state and memoize them
  const markers = useMemo(() => {
    return Object.values(markersOnScreen);
  }, [markersOnScreen]);

  return (
    <div className="flex flex-col h-screen">
      {/* <div className="flex justify-center bg-white border-b-2 border-blue-50">
        <button className="bg-blue-50 rounded-md px-8 py-2 m-1">Test</button>
      </div> */}
      <div className="flex flex-grow overflow-y-auto">
        <Sidebar>
          {sidebarLoading ? (
            <SideBarSkeleton />
          ) : events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <SideBarNoEventsSkeleton />
          )}
        </Sidebar>
        <div className="flex justify-center flex-grow">
          <Map
            ref={eventsMap}
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
          {showButton && <SearchButton onClick={handleOnSearch} />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
