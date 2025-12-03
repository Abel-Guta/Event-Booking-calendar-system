"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function Calendar() {
  return (
    <div
      className="p-4 bg-white rounded-xl shadow 
     
      max-w-[900px] 
      
       
      h-auto
    "
    >
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
        events={[
          {
            id: "1",
            title: "Event A",
            date: "2025-12-05",
            color: "linear-gradient(135deg,#fbc2eb 0%,#a6c1ee 100%)",
          },
          {
            id: "2",
            title: "Event B",
            date: "2025-12-08",
            color: "linear-gradient(135deg,#f6d365 0%,#fda085 100%)",
          },
          {
            id: "3",
            title: "Event C",
            date: "2025-12-12",
            color: "linear-gradient(135deg,#e0c3fc 0%,#8ec5fc 100%)",
          },
        ]}
        eventContent={({ event }) => {
          const color = event.extendedProps.color;

          return (
            <div
              className="w-full h-20 rounded-2xl flex flex-col items-center justify-end pb-2"
              style={{
                background: color,
              }}
            >
              <div className="w-10 h-10 rounded-full bg-black/40"></div>
            </div>
          );
        }}
      />
    </div>
  );
}
