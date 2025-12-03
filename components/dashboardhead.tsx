"use client";

import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CreateEventModal } from "./createEventModal";

const Dashboardhead = ({
  type,
}: {
  type: "home" | "my events" | "my bookings";
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="flex flex-col  md:flex-row  md:justify-between items-center px-8 bg-white p-4 rounded-2xl shadow-4xl z-5">
      <div>
        <h1 className="text-bold text-3xl mb-2  ">Dashboard Overview</h1>
        <p className="text-sm text-black/50">
          Welcome back! Here's what's happening today
        </p>
      </div>
      <div className="flex flex-col  md:flex-row gap-2 ">
        <div className="border rounded-xl  flex justify-between items-center w-full ">
          <SearchIcon className="mx-2" />
          <Input className="border-none outline-none focus-visible:border-0 focus-visible:ring-0" />
        </div>
        <div className={`w-full  ${type === "my events" ? "" : "hidden"}`}>
          <Button
            className="bg-linear-to-r from-red-500 via-orange-400 to-yellow-300 px-8 w-full"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Create event
          </Button>
        </div>
      </div>
      <CreateEventModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </div>
  );
};

export default Dashboardhead;
