"use client";
import { useEventStore } from "@/utils/zustand/eventstore";
import Eventcard from "./eventcard";
import { formatTime } from "./calendar";

const EventList = () => {
  const { events } = useEventStore();
  console.log(events);

  return (
    <div className="flex flex-col gap-3 w-full">
      {events.map((event) => {
        const formattedtime = formatTime(event.eventtime);
        return (
          <div key={event.id} className="flex flex-col bg-white rounded-xl p-3">
            <Eventcard
              title={event.eventname}
              time={formattedtime}
              attendees={event.attendees?.length ?? 0}
              category={event.eventcategory}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EventList;
