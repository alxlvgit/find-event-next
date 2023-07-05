import mapboxgl from "mapbox-gl";
import React, { memo } from "react";
import { Marker } from "react-map-gl";

const CustomMarker = memo(function CustomMarker({
  feature,
}: {
  feature: GeoJSON.Feature<GeoJSON.Point>;
}) {
  const { id, geometry } = feature;
  const popup: mapboxgl.Popup = new mapboxgl.Popup({
    offset: 25,
    className: "z-50 popup",
  }).setHTML(feature.properties!.popupHTML);
  const icon = feature.properties!.icon;

  return (
    <Marker
      key={id}
      longitude={geometry.coordinates[0]}
      latitude={geometry.coordinates[1]}
      popup={popup}
    >
      <div className="marker bg-no-repeat bg-cover bg-center w-8 h-8 rounded-full border-2 border-[#437bca] shadow-lg cursor-pointer bg-white">
        <div
          className="w-full h-full rounded-full absolute top-0 left-0 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${icon})`,
          }}
        ></div>
      </div>
    </Marker>
  );
});

export default CustomMarker;
