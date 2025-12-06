import Calendar from "@/components/calendar";
import Dashboardhead from "@/components/dashboardhead";
import EventList from "@/components/EventList";
import Statcards from "@/components/statcards";

const Events = () => {
  return (
    <>
      <Dashboardhead type="my events" />

      <div className="md:grid md:grid-cols-2  gap-10 mt-9 hidden lg:flex lg:justify-center">
        <Statcards title="Total Events" number={469} />
        <Statcards title="Tickets Sold" number={765} />
        <Statcards title="Revenue" number={5680} />
        <Statcards title="Attendees" number={250} />
      </div>
      <div className="flex flex-col gap-5  md:gap-3 lg:flex-row mt-10">
        <Calendar type="my events" />
        <EventList />
      </div>
    </>
  );
};

export default Events;
