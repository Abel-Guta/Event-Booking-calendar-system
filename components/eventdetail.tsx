"use client";

import { format } from "date-fns";
import { MapPin, Calendar, Clock, Users, Ticket, List } from "lucide-react";
import { useEffect, useState } from "react";
import { getevent } from "@/lib/helpers/event-helpers";
import { Events } from "./calendar"; // reuse your Event type
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/utils/supabase/client";
import { getCurrentUser } from "@/lib/helpers/auth-helpers";
import { Button } from "./ui/button";

const EventDetail = ({ id }: { id: string }) => {
  const [event, setEvent] = useState<Events | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | undefined>();

  useEffect(() => {
    async function fetchevent() {
      const eventdata = await getevent(id);
      setEvent(eventdata);
      setLoading(false);
      const userdata = await getCurrentUser();
      setUser(userdata.id);
    }
    fetchevent();
  }, [id]);

  console.log(user);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-lg">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-lg text-red-500">Event not found.</p>
      </div>
    );
  }

  const formattedDate = format(new Date(event.eventdate), "EEEE, MMMM d, yyyy");

  const formattedTime = event.eventtime
    ? new Date(`1970-01-01T${event.eventtime}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-linear-to-br from-red-500 via-orange-400 to-yellow-300 text-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">{event.eventname}</h1>
        <p className="text-lg opacity-90">{event.eventcategory}</p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            {event.eventdescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-neutral-500">Date</p>
              <p className="font-semibold">{formattedDate}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-neutral-500">Time</p>
              <p className="font-semibold">{formattedTime}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-neutral-500">Location</p>
              <p className="font-semibold">{event.eventlocation}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm flex items-center gap-3">
            <Ticket className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-neutral-500">Tickets Available</p>
              <p className="font-semibold">{event.eventtickets}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-neutral-500">Attendees</p>
              <p className="font-semibold">{event.attendees?.length ?? 0}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm flex items-center gap-3">
            <List className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-neutral-500">Category</p>
              <p className="font-semibold">{event.eventcategory}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-7 mt-5">
        <Button className="flex-1 bg-linear-to-br from-red-500 via-orange-400 to-yellow-300 hover:scale-[1.1] active:scale-[0.97]">
          Book
        </Button>
        <Button
          className={` ${event.createdby != user ? "hidden" : ""} flex-1 hover:scale-[1.1] active:scale-[0.97]`}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default EventDetail;
