import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export async function createEvent(event: {
  eventname: string;
  eventdescription: string;
  eventcategory: string;
  eventdate: Date;
  eventtime: string;
  eventtickets: string;
  eventlocation: string;
}) {
  try {
    const supabase = createClient();

    const formattedDate = event.eventdate.toISOString().split("T")[0];

    const { data, error } = await supabase.from("events").insert({
      ...event,
      eventdate: formattedDate,
      eventtickets: Number(event.eventtickets),
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success("Event created!");
    return data;
  } catch (err: any) {
    console.log(err);
    toast.error(err.message);
  }
}

export async function getAllEvents() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      toast.error(error.message);
      throw error;
    }

    return data;
  } catch (err: any) {
    console.log(err);
  }
}
