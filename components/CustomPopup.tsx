import { IFeatureProperties } from "@/interfaces/interfaces";
import { Popup } from "react-map-gl";
import Image from "next/image";
import Link from "next/link";
import { eventPricing } from "@/utils/helpers";

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
  const { popupImage, title, date, time, url, pricing } =
    feature.properties as IFeatureProperties;
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      closeButton={true}
      closeOnClick={true}
      closeOnMove={true}
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
        <h3 className="text-sm font-semibold text-center mb-1">{title}</h3>
        <div className="w-full flex justify-center items-center">
          <Image
            src="/date.svg"
            alt="date"
            width={16}
            height={16}
            className="mr-1"
          ></Image>
          <p className="text-xs text-center">{date}</p>
        </div>
        <div className="flex w-full justify-center items-center">
          <Image
            src="/time.svg"
            alt="time"
            width={16}
            height={16}
            className="mr-1"
          ></Image>
          <p className="text-xs text-center">{time}</p>
        </div>
        <div className="flex w-full justify-center items-center">
          <Image
            src="/dollar.svg"
            alt="price"
            width={16}
            height={16}
            className="mr-1"
          ></Image>
          <p className="text-xs text-center">{pricing}</p>
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
