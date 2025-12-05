// store/events.ts

import { Events } from "@/components/calendar";
import { create } from "zustand";

type EventState = {
  events: Events[];
  setEvents: (events: Events[] | undefined) => void;
};

export const useEventStore = create<EventState>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
}));
