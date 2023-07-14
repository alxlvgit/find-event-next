import { IFeatureProperties } from "@/interfaces/interfaces";
import { Popup } from "react-map-gl";
import Image from "next/image";
import Link from "next/link";

export const CustomPopup = ({
  longitude,
  latitude,
  onClose,
  feature,
}: {
  longitude: number;
  latitude: number;
  onClose: () => void;
  feature: GeoJSON.Feature<GeoJSON.Point>;
}) => {
  const { popupImage, title, date, time, url } =
    feature.properties as IFeatureProperties;
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      closeButton={true}
      closeOnClick={true}
      offset={25}
      onClose={() => {
        onClose();
      }}
      className="z-50 popup"
    >
      <div className="flex flex-col w-32 justify-center items-center">
        <Image
          src={popupImage}
          alt={title}
          width={305}
          height={225}
          className={" w-32 rounded-md shadow-lg mb-2"}
        />
        <h3 className="text-sm font-semibold text-center">{title}</h3>
        <div className="flex flex-row justify-center items-center space-x-2">
          <p className="text-xs text-center">{date}</p>
          <p className="text-xs text-center">{time}</p>
        </div>
        <div className="flex flex-row justify-center items-center space-x-3 mt-1">
          <Link
            href={url}
            target="_blank"
            className="text-sm text-center text-[#437bca] font-semibold hover:text-[#79acf4]"
          >
            Buy Tickets
          </Link>
        </div>
      </div>
    </Popup>
  );
};