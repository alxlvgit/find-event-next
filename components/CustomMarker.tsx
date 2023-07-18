import React, { memo } from "react";
import { Marker } from "react-map-gl";
import { useAppSelector } from "@/redux/hooks";
import { useAppDispatch } from "@/redux/hooks";
import { setActivePopup } from "@/redux/features/mapSlice";
import { CustomPopup } from "./CustomPopup";
import { IFeatureProperties } from "@/interfaces/interfaces";

const CustomMarker = memo(function CustomMarker({
  feature,
}: {
  feature: GeoJSON.Feature<GeoJSON.Point>;
}) {
  const [longitude, latitude] = feature.geometry.coordinates;
  const { icon, id } = feature.properties as IFeatureProperties;
  const [showPopup, setShowPopup] = React.useState(false);
  const activePopup = useAppSelector((state) => state.mapSlice.activePopup);
  const dispatch = useAppDispatch();
  const handlePopupClose = () => {
    setShowPopup(false);
    dispatch(setActivePopup(null));
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setShowPopup(true);
        dispatch(setActivePopup(id));
      }}
    >
      <Marker longitude={longitude} latitude={latitude}>
        <div className="marker bg-no-repeat bg-cover bg-center w-8 h-8 rounded-full border-2 border-[#437bca] shadow-lg cursor-pointer bg-white">
          <div
            className="w-full h-full rounded-full absolute top-0 left-0 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${icon})`,
            }}
          ></div>
        </div>
      </Marker>
      <div className="relative w-32 h-32">
        {showPopup && activePopup === id && (
          <CustomPopup
            longitude={longitude}
            latitude={latitude}
            onClose={() => {
              handlePopupClose();
            }}
            feature={feature}
          ></CustomPopup>
        )}
      </div>
    </div>
  );
});

export default CustomMarker;
