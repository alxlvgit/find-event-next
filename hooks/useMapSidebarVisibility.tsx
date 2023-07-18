import { useMemo } from "react";

export const useMapSidebarVisibility = (showMap: boolean) => {
  const componentVisibility = useMemo(() => {
    return showMap ? "flex" : "hidden";
  }, [showMap]);

  return componentVisibility;
};
