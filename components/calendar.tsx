"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect } from "react";
import { getAllEvents } from "@/lib/helpers/event-helpers";
import { createClient } from "@/utils/supabase/client";
import { useEventStore } from "@/utils/zustand/eventstore";
import Link from "next/link";

const categoryColors: Record<string, string> = {
  Music: "bg-purple-500/70",
  Business: "bg-blue-400/70",
  Sports: "bg-green-400/70",
  Education: "bg-yellow-400/70",
};
export type Events = {
  id: number;
  eventname: string;
  eventdescription: string;
  eventcategory: string;
  eventdate: string;
  eventtime: string;
  eventtickets: number;
  eventlocation: string;
  createdby: string;
  created_at: string;
  attendees: string[] | null;
};
export function formatTime(time: string) {
  const [hour, minute] = time.split(":");
  let h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${minute} ${ampm}`;
}

export default function Calendar() {
  const { events, setEvents } = useEventStore();

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch if events are empty
    async function fetchEvents() {
      const allEvents = await getAllEvents();
      setEvents(allEvents);
    }

    if (events.length === 0) fetchEvents();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel("public:events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          fetchEvents(); // Or update intelligently
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [events.length, setEvents]);

  const simpleEvents = events?.map((event) => ({
    id: event.id.toString(),
    title: event.eventname,
    date: event.eventdate,
  }));

  console.log(events);
  return (
    <div className="p-4 bg-white rounded-xl shadow max-w-[900px] h-auto">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        editable
        selectable
        handleWindowResize
        height="auto"
        contentHeight="auto"
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        events={simpleEvents}
        eventContent={({ event }) => {
          const originalEvent = events.find(
            (e) => e.id.toString() === event.id
          );
          const bgClass = originalEvent
            ? categoryColors[originalEvent.eventcategory] || "bg-gray-400/70"
            : "bg-gray-400/70";

          return (
            <Link href={`/events/${event.id}`}>
              <div
                className={`rounded-2xl p-2 flex flex-col justify-between text-white shadow-lg ${bgClass} border border-white/20 hover:scale-[1.2]`}
              >
                <div className="text-xs font-bold uppercase opacity-80">
                  {originalEvent?.eventcategory}
                </div>
                <div className="text-sm font-semibold text-white leading-snug whitespace-normal wrap-break-word">
                  {event.title}
                </div>
                <div className="text-[10px] opacity-70">
                  {originalEvent?.eventtime &&
                    formatTime(originalEvent.eventtime)}
                </div>
              </div>
            </Link>
          );
        }}
      />
    </div>
  );
}
