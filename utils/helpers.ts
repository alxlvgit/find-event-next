import { IEvent, IImage } from "@/interfaces/interfaces";
import turf from "turf";
import { Map } from "mapbox-gl";

// This function creates a GeoJSON FeatureCollection from an array of events
export const createGeoJsonFromEvents = (
  events: IEvent[],
  coordinates: Set<string>
): GeoJSON.FeatureCollection => {
  const features: GeoJSON.Feature[] = events
    .filter(
      (event: IEvent) =>
        event._embedded?.venues?.[0]?.location?.longitude &&
        event._embedded?.venues?.[0]?.location?.latitude
    )
    .map((event: IEvent) => {
      const { longitude, latitude } = event._embedded.venues[0].location;
      const { id, name } = event;
      const classification =
        (event.classifications && event.classifications[0]?.segment?.name) ||
        "Miscellaneous";
      return {
        type: "Feature",
        properties: {
          id: id,
          title: name,
          popupImage: filterImagesForPopUp(event),
          icon: assignIconByCategory(classification),
          date: eventDate(event),
          time: eventTime(event),
          url: event.url || "",
          pricing: eventPricing(event),
        },
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
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
export const filterImagesForPopUp = (event: IEvent): string => {
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
export const applyOffsets = (
  coordinates: Set<string>,
  features: GeoJSON.Feature[]
): GeoJSON.Feature[] => {
  const featuresWithOffsets = features.map((feature: any, index: number) => {
    const longitude = +feature.geometry.coordinates[0];
    const latitude = +feature.geometry.coordinates[1];
    const longitudeRounded = longitude.toFixed(3);
    const latitudeRounded = latitude.toFixed(3);
    const locationKey = `${longitudeRounded},${latitudeRounded}`;
    if (coordinates.has(locationKey)) {
      const offsetDistance = 0.5 * index;
      const point = turf.point([longitude, latitude]);

      // Generate a random bearing between 0 and 360 degrees
      const bearing = Math.random() * 360;
      const offsetPoint = turf.destination(
        point,
        offsetDistance,
        bearing,
        "meters"
      );
      const offsetLng = offsetPoint.geometry.coordinates[0];
      const offsetLat = offsetPoint.geometry.coordinates[1];
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: [offsetLng, offsetLat],
        },
      };
    } else {
      coordinates.add(locationKey);
      return feature;
    }
  });
  return featuresWithOffsets;
};

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
};

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
};

// This function filters the price range for an event
export const eventPricing = (event: IEvent): string => {
  if (event.priceRanges) {
    const minPrice = event.priceRanges?.[0]?.min || "";
    const maxPrice = event.priceRanges?.[0]?.max || "";
    const currency = event.priceRanges?.[0]?.currency || "";
    const priceRange =
      !minPrice || !maxPrice || !currency
        ? "N/A"
        : minPrice === 0 || maxPrice === 0
        ? "N/A"
        : minPrice === maxPrice
        ? `${minPrice} ${currency}`
        : `${minPrice} - ${maxPrice} ${currency}`;
    return priceRange;
  }
  return "N/A";
};

// This function filters the venue and city for an event
export const eventVenue = (event: IEvent): string => {
  if (event._embedded?.venues) {
    const venue = event._embedded.venues[0].name || "";
    const city = event._embedded.venues[0].city?.name || "";
    const venueCity =
      !venue && !city
        ? "N/A"
        : !venue && city
        ? city
        : venue && !city
        ? venue
        : `${city}, ${venue}`;
    return venueCity;
  }
  return "N/A";
};

// This function filters the event date for an event

export const eventDate = (event: IEvent): string => {
  const eventDate = event.dates?.start?.localDate
    ? event.dates.start.localDate
    : "TBD";
  return eventDate;
};

// This function filters the event time for an event
export const eventTime = (event: IEvent): string => {
  const eventTime = event.dates?.start?.noSpecificTime
    ? "N/A"
    : event.dates?.start?.localTime
    ? event.dates.start.localTime.split(":").slice(0, 2).join(":")
    : "N/A";
  return eventTime;
};
