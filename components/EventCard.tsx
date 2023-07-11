import React from "react";
import Card from "./Card";
import Image from "next/image";
import { IEvent } from "@/interfaces/interfaces";

const EventCard = ({
  event,
  lastCardRef,
}: {
  event: IEvent;
  lastCardRef?: (node: HTMLLIElement) => void;
}) => {
  const { name, dates } = event;
  const eventImage = event.images?.filter(
    (image) => image.ratio === "16_9" && image.width === 640
  );
  return (
    <Card lastCardRef={lastCardRef}>
      <div className="event-image w-full">
        <Image
          className="rounded-md"
          src={
            eventImage && eventImage[0]
              ? eventImage[0].url
              : "/placeholder.webp"
          }
          alt="Picture of the event"
          width={640}
          height={360}
        ></Image>
      </div>
      <div className="event-info mt-1">
        <div className="event-title text-base font-semibold line-clamp-1">
          {name}
        </div>
        <div className="event-start text-sm text-gray-600">
          {dates.start?.localDate ? dates.start.localDate : "TBD"}
          {dates.end?.localDate ? ` - ${dates.end.localDate}` : ""}
        </div>
        <div className="event-time text-sm text-gray-600">
          {dates.start?.noSpecificTime
            ? "N/A"
            : dates.start?.localTime
            ? dates.start?.localTime.split(":").slice(0, 2).join(":")
            : "N/A"}
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
