import { ILocation } from "@/interfaces/interfaces";

export default async function getEvents(
  location: ILocation,
  radius: number,
  classification: string
) {
  const TICKETMASTER_API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
  const locationQuery = `latlong=${location.latitude},${location.longitude}&unit=km&radius=${radius}&sort=date,asc&size=20`;
  let querySearchParam = "";
  if (classification) {
    querySearchParam = `&classificationName=${classification}`;
  }
  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&${locationQuery}${querySearchParam}`
  );
  if (!res.ok) {
    console.log("error");
  }
  const data = await res.json();
  return data;
}
