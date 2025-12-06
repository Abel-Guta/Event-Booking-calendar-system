"use client";
import { useEventStore } from "@/utils/zustand/eventstore";
import Eventcard from "./eventcard";
import { formatTime } from "./calendar";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/helpers/auth-helpers";

const EventList = ({
  type,
}: {
  type: "home" | "my events" | "my bookings";
}) => {
  const { events } = useEventStore();
  const [user, setUser] = useState<string>();

  useEffect(() => {
    async function fetchuser() {
      const user = await getCurrentUser();
      setUser(user.id);
    }
    fetchuser();
  }, []);

  let simpleEvents = [];

  switch (type) {
    case "my events":
      simpleEvents = events
        ?.map((event) => ({
          ...event,
        }))
        .filter((event) => event.createdby === user);

      break;

    case "my bookings":
      simpleEvents = events
        ?.map((event) => ({
          ...event,
        }))
        .filter((event) => event.attendees?.includes(user!));

      break;

    default:
      simpleEvents = events?.map((event) => ({
        ...event,
      }));
      break;
  }
  console.log(simpleEvents);

  return (
    <div className="flex flex-col gap-3 w-full">
      {simpleEvents.map((event) => {
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
