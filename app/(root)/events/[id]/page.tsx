import EventDetail from "@/components/eventdetail";

import { getevent } from "@/lib/helpers/event-helpers";

interface EventDetailsProps {
  params: {
    id: string;
  };
}

const EventDetails = async ({ params }: EventDetailsProps) => {
  const { id } = await params;
  const eventdata = await getevent(id);

  return <EventDetail event={eventdata} />;
};

export default EventDetails;
