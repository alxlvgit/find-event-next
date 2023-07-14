import { IEvent, IImage } from "@/interfaces/interfaces";
import turf from "turf";
import { Map } from "mapbox-gl";

// This function creates a GeoJSON FeatureCollection from an array of events
export const createGeoJsonFromEvents = (
  events: IEvent[],
  coordinates: Set<string>
): GeoJSON.FeatureCollection => {
  const features: GeoJSON.Feature[] = events.map((event: IEvent) => {
    const { longitude, latitude } = event._embedded.venues[0].location;
    const { id, name } = event;
    const classification = event.classifications && event.classifications[0]?.segment?.name || "Miscellaneous";
    const eventDate = event.dates?.start?.localDate
      ? event.dates.start.localDate
      : "TBD";
    const eventTime = event.dates?.start?.noSpecificTime
      ? "N/A"
      : event.dates?.start?.localTime
        ? event.dates.start.localTime.split(":").slice(0, 2).join(":")
        : "N/A";
    return {
      type: "Feature",
      properties: {
        id: id,
        title: name,
        popupImage: filterImagesForPopUp(event),
        icon: assignIconByCategory(classification),
        date: eventDate,
        time: eventTime,
        url: event.url || "",
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
  const featuresWithOffsets = applyOffsets(coordinates, features);
  return {
    type: "FeatureCollection",
    features: featuresWithOffsets,
  };
};


// This function filters the images for the pop-up to only include images with a 4:3 ratio and a width of 305px
export const filterImagesForPopUp = (
  event: IEvent
): string => {
  const eventImage: IImage[] = event.images.filter(
    (image) => image.ratio === "4_3" && image.width === 305
  );
  if (eventImage.length > 0 && eventImage[0].url) {
    return eventImage[0].url;
  } else {
    return "";
  }
};

// This function applies offsets to markers that are in the same location
export const applyOffsets = (coordinates: Set<string>, features: GeoJSON.Feature[]): GeoJSON.Feature[] => {
  const featuresWithOffsets = features.map((feature: any) => {
    const longitude = +feature.geometry.coordinates[0];
    const latitude = +feature.geometry.coordinates[1];
    const longitudeRounded = longitude.toFixed(3);
    const latitudeRounded = latitude.toFixed(3);
    const locationKey = `${longitudeRounded},${latitudeRounded}`;
    if (coordinates.has(locationKey)) {
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
      coordinates.add(locationKey);
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

// This function calculates the radius of the map based on the current bounds
export const getRadiusFromBounds = (map: Map): number | null => {
  if (map) {
    const bounds = map.getBounds();
    const center = map.getCenter();
    const radius = turf.distance(
      turf.point([bounds.getNorth(), center.lng]),
      turf.point([bounds.getSouth(), center.lng]),
      "kilometers"
    );
    return Math.round(radius);
  }
  return null;
}

export const filterDuplicateEvents = (events: IEvent[]): IEvent[] => {
  const uniqueNames: string[] = [];
  const uniqueEvents: IEvent[] = [];
  events.some(event => {
    if (!uniqueNames.includes(event.name)) {
      if (event._embedded?.attractions) {
        if (!uniqueNames.includes(event._embedded.attractions[0].name)) {
          uniqueNames.push(event.name);
          uniqueNames.push(event._embedded.attractions[0].name);
          uniqueEvents.push(event);
        }
      } else {
        uniqueNames.push(event.name);
        uniqueEvents.push(event);
      }
    }
  });
  return uniqueEvents;
};