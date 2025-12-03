import React from "react";
import Eventcard from "./eventcard";

const EventList = () => {
  return (
    <div className="flex flex-col bg-white w-full rounded-xl">
      <Eventcard
        title={"Football"}
        time={"2:00"}
        attendees={20}
        category={"Sports"}
      />
    </div>
  );
};

export default EventList;
