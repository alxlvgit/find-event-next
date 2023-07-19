import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setShowMap } from "@/redux/features/mapSlice";

export const ShowMapButton = () => {
  const dispatch = useAppDispatch();
  const showMap = useAppSelector((state) => state.mapSlice.showMap);
  const handleClick = () => {
    dispatch(setShowMap(!showMap));
  };

  return (
    <div className="flex-grow flex justify-end">
      <button
        onClick={() => {
          handleClick();
        }}
        className="flex justify-center items-center md:hidden"
      >
        {showMap ? (
          <Image src="/list.svg" alt="map" width={26} height={26} />
        ) : (
          <Image src="/map.svg" alt="map" width={26} height={26} />
        )}
      </button>
    </div>
  );
};
