"use client";

import { format } from "date-fns";
import { MapPin, Calendar, Clock, Users, Ticket, List } from "lucide-react";
import { JSX, useEffect, useState } from "react";

import { Events } from "./calendar";

import { getCurrentUser } from "@/lib/helpers/auth-helpers";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { updateEventAttendees } from "@/lib/helpers/event-helpers";

const EventDetail = ({ event }: { event: Events }) => {
  const [userid, setUserid] = useState<string>();
  const [realevent, setRealEvent] = useState<Events>(event);

  useEffect(() => {
    async function fetchUser() {
      const userdata = await getCurrentUser();
      setUserid(userdata.id);
    }
    fetchUser();

    const supabase = createClient();

    const subscription = supabase
      .channel("public:events")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `id=eq.${event.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Events>) => {
          if (payload.new) {
            setRealEvent(payload.new as Events);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [event.id]);

  if (!realevent) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-lg text-red-500">Event not found.</p>
      </div>
    );
  }
  async function BookEvent() {
    if (!userid) return; // make sure user id is loaded
    await updateEventAttendees({
      eventid: realevent.id.toString(),
      userid: userid,
    });
  }

  const formattedDate = format(
    new Date(realevent.eventdate),
    "EEEE, MMMM d, yyyy"
  );
  const formattedTime = realevent.eventtime
    ? new Date(`1970-01-01T${realevent.eventtime}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-orange-400/90 text-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">{realevent.eventname}</h1>
        <p className="text-lg opacity-90">{realevent.eventcategory}</p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            {realevent.eventdescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<Calendar className="w-6 h-6 text-primary" />}
            label="Date"
            value={formattedDate}
          />
          <InfoCard
            icon={<Clock className="w-6 h-6 text-primary" />}
            label="Time"
            value={formattedTime}
          />
          <InfoCard
            icon={<MapPin className="w-6 h-6 text-primary" />}
            label="Location"
            value={realevent.eventlocation}
          />
          <InfoCard
            icon={<Ticket className="w-6 h-6 text-primary" />}
            label="Tickets Available"
            value={realevent.eventtickets.toString()}
          />
          <InfoCard
            icon={<Users className="w-6 h-6 text-primary" />}
            label="Attendees"
            value={(realevent.attendees?.length ?? 0).toString()}
          />
          <InfoCard
            icon={<List className="w-6 h-6 text-primary" />}
            label="Category"
            value={realevent.eventcategory}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-7 mt-5">
        <Button
          className="flex-1 bg-orange-400/90 hover:bg-yellow-500 active:bg-yellow-600 hover:scale-[1.1] active:scale-[0.97]"
          onClick={BookEvent}
        >
          Book
        </Button>
        <Button
          className={` ${realevent.createdby !== userid ? "hidden" : ""} flex-1 hover:scale-[1.1] active:scale-[0.97]`}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

// Small reusable card for info items
const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) => (
  <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm flex items-center gap-3">
    {icon}
    <div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default EventDetail;
