import React from "react";
import Card from "./Card";
import Image from "next/image";
import { IEvent } from "@/interfaces/interfaces";
import Link from "next/link";
import { eventPricing, eventVenue } from "@/utils/helpers";

const EventCard = ({
  event,
  lastCardRef,
}: {
  event: IEvent;
  lastCardRef?: (node: HTMLLIElement) => void;
}) => {
  const { name, dates } = event;
  const eventImage = event.images?.filter(
    (image) => image.ratio === "16_9" && image.width === 1024
  );
  const eventPriceRange = eventPricing(event);
  const eventLocation = eventVenue(event);

  return (
    <Card lastCardRef={lastCardRef}>
      <Link
        target={"_blank"}
        className="absolute w-full h-full"
        href={`${event.url}`}
        id={event.id}
      ></Link>
      <div className="event-image w-full">
        <Image
          className="rounded-xl"
          src={
            eventImage && eventImage[0]
              ? eventImage[0].url
              : "/placeholder.webp"
          }
          alt="Picture of the event"
          width={1024}
          height={576}
        ></Image>
      </div>
      <h1 className="event-title text-sm xs:text-base m-2 font-semibold line-clamp-1">
        {name}
      </h1>
      <div className="event-info pb-2 px-2 flex justify-between w-full">
        <div className="w-1/3 flex flex-col items-start">
          <div className="event-date mb-1 xs:text-sm text-xs text-gray-600 flex items-center">
            <Image
              src="/date.svg"
              alt="date"
              width={16}
              height={16}
              className="mr-1"
            ></Image>
            {dates.start?.localDate ? dates.start.localDate : "TBD"}
            {dates.end?.localDate ? ` - ${dates.end.localDate}` : ""}
          </div>
          <div className="event-time xs:text-sm text-xs text-gray-600 flex items-center">
            <Image
              src="/time.svg"
              alt="time"
              width={16}
              height={16}
              className="mr-1"
            ></Image>
            {dates.start?.noSpecificTime
              ? "N/A"
              : dates.start?.localTime
              ? dates.start?.localTime.split(":").slice(0, 2).join(":")
              : "N/A"}
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="event-venue xs:text-sm mb-1 text-xs text-gray-600 flex items-center">
            <Image
              src="/location.svg"
              alt="location"
              width={16}
              height={16}
              className="mr-1"
            ></Image>
            <p className="line-clamp-2">{eventLocation}</p>
          </div>
          <div className="event-price xs:text-sm text-xs text-gray-600 flex items-center">
            <Image
              src="/dollar.svg"
              alt="price"
              width={16}
              height={16}
              className="mr-1"
            ></Image>
            {eventPriceRange}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
