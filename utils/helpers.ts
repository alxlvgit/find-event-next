import { IEvent, IImage } from "@/interfaces/interfaces";
import turf from "turf";
import { MutableRefObject } from "react";

// This function creates a GeoJSON FeatureCollection from an array of events
export const createGeoJsonFromEvents = (
  events: IEvent[]
): GeoJSON.FeatureCollection => {
  const features: GeoJSON.Feature[] = events.map((event: IEvent) => {
    const { longitude, latitude } = event._embedded.venues[0].location;
    return {
      type: "Feature",
      properties: {
        id: event.id,
        title: event.name,
        popupHTML: createMarkerPopUpHTML(event),
        icon: assignIconByCategory(event.classifications[0].segment.name),
      },
      geometry: {
        type: "Point",
        coordinates: [
          longitude,
          latitude
        ],
      },
    };
  });
  return {
    type: "FeatureCollection",
    features: features,
  };
};

// This function filters the images for the pop-up to only include images with a 4:3 ratio and a width of 305px
const filterImagesForPopUp = (
  event: IEvent
): IImage | null => {
  const eventImage: IImage[] = event.images.filter(
    (image) => image.ratio === "4_3" && image.width === 305
  );
  if (eventImage.length > 0 && eventImage[0].url) {
    return eventImage[0];
  } else {
    return null;
  }
};


// This function creates the HTML for the pop-up that appears when a user clicks on a marker
export const createMarkerPopUpHTML = (event: IEvent): string => {
  let eventImage = filterImagesForPopUp(event)?.url;
  const eventDate = event.dates.start.localDate
    ? event.dates.start.localDate
    : "TBD";
  const eventTime = event.dates.start.noSpecificTime
    ? "N/A"
    : event.dates.start.localTime
      ? event.dates.start.localTime.split(":").slice(0, 2).join(":")
      : "N/A";

  return ` <div class="flex flex-col w-32 justify-center items-center">
      <img alt=${event.name} src=${eventImage} class="w-32 rounded-md shadow-lg mb-2">
                                <h3 class="text-sm font-semibold text-center">${event.name}</h3>
                                <div class="flex flex-row justify-center items-center space-x-2">
                                <i class="far fa-calendar-alt"></i>
                                <p class="text-xs text-center">${eventDate}</p>
                                <i class="far fa-clock"></i>
                                <p class="text-xs text-center">${eventTime}</p>
                                </div>
                                <div class = "flex flex-row justify-center items-center space-x-3 mt-1">
                                <a href="${event.url}" target="_blank" class="text-sm text-center text-[#437bca] font-semibold hover:text-[#79acf4]">Buy Tickets</a>
                                </div>
                            </div>`;
};


// This function applies offsets to markers that are in the same location
export const applyOffsets = (coordinates: MutableRefObject<Set<string>>, features: GeoJSON.Feature[]): GeoJSON.Feature[] => {
  const featuresWithOffsets = features.map((feature: any) => {
    const longitude = +feature.geometry.coordinates[0];
    const latitude = +feature.geometry.coordinates[1];

    const longitudeRounded = longitude.toFixed(3);
    const latitudeRounded = latitude.toFixed(3);
    const locationKey = `${longitudeRounded},${latitudeRounded}`;
    if (coordinates.current.has(locationKey)) {
      const offsetDistance = 10;
      const point = turf.point([longitude, latitude]);

      // Generate a random bearing between 0 and 360 degrees
      const bearing = Math.random() * 360;

      const offsetPoint = turf.destination(point, offsetDistance, bearing, "meters");
      const offsetLng = offsetPoint.geometry.coordinates[0];
      const offsetLat = offsetPoint.geometry.coordinates[1];

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: [offsetLng, offsetLat]
        }
      }
    }
    else {
      coordinates.current.add(locationKey);
      return feature;
    }
  })
  return featuresWithOffsets;
}

// This function assigns an icon to a marker based on the event category
const assignIconByCategory = (category: string): string => {
  switch (category) {
    case "Music":
      return "/music.svg";
    case "Sports":
      return "/sport.svg";
    case "Arts & Theatre":
      return "/art.svg";
    case "Miscellaneous":
      return "/other.svg";
    default:
      return "/other.svg";
  }
}