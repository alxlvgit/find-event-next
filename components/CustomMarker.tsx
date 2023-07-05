import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";
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

  return (
    <Marker
      key={id}
      longitude={geometry.coordinates[0]}
      latitude={geometry.coordinates[1]}
      popup={popup}
    >
      <div className="relative marker bg-no-repeat bg-cover bg-center w-8 h-8 rounded-full border-2 border-[#878d26] shadow-lg cursor-pointer">
        <div className="w-full h-full bg-black/25 rounded-full absolute top-0 left-0"></div>
      </div>
    </Marker>
  );
});

export default CustomMarker;
