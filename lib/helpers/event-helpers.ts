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
export async function getevent(id: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) {
      toast.error(error.message);
      throw error;
    }

    return data;
  } catch (err: any) {
    console.log(err);
  }
}

export async function updateEventAttendees({
  eventid,
  userid,
}: {
  eventid: string;
  userid: string;
}) {
  try {
    const supabase = createClient();
    const { data: eventData, error: fetchError } = await supabase
      .from("events")
      .select("attendees,eventtickets")
      .eq("id", Number(eventid))
      .single();
    if (fetchError) throw fetchError;

    const currentAttendees = eventData?.attendees ?? [];

    if (currentAttendees.includes(userid)) {
      toast.error("You already booked");
      return;
    }

    if (!eventData.eventtickets || eventData.eventtickets <= 0) {
      toast.error("Fully booked");
      return;
    }

    const updatedAttendees = [...currentAttendees, userid];
    const updatedTickets = eventData.eventtickets - 1;

    const { data: updatedData, error: updateError } = await supabase
      .from("events")
      .update({ attendees: updatedAttendees, eventtickets: updatedTickets })
      .eq("id", Number(eventid))
      .select("*");

    if (updateError) {
      toast.error(updateError.message);
      throw updateError;
    }

    toast.success("Successfully booked the event!");
    return updatedData;
  } catch (err: any) {
    console.log(err);
  }
}
