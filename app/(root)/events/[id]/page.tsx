import EventDetail from "@/components/eventdetail";

interface EventDetailsProps {
  params: {
    id: string;
  };
}

const EventDetails = async ({ params }: EventDetailsProps) => {
  const { id } = await params;
  console.log(id);
  return <EventDetail id={id} />;
};

export default EventDetails;
