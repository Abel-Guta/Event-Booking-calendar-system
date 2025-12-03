import { CalendarCheck, TicketCheck, DollarSign, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Statcardsprops {
  title: "Total Events" | "Tickets Sold" | "Revenue" | "Attendees";
  number: number;
}

const icons = {
  "Total Events": CalendarCheck,
  "Tickets Sold": TicketCheck,
  Revenue: DollarSign,
  Attendees: Users,
};

const colors = {
  "Total Events": "bg-orange-300",
  "Tickets Sold": "bg-orange-400",
  Revenue: "bg-amber-500",
  Attendees: "bg-orange-600",
};

const Statcards = ({ title, number }: Statcardsprops) => {
  const Icon = icons[title];
  const color = colors[title];

  return (
    <Card className={`min-w-50 ${color} `}>
      <CardContent className="flex flex-row items-center gap-5 text-white">
        <Icon className="w-12 h-12" />
        <p className="font-bold text-2xl ">{number}</p>
        <p>{title}</p>
      </CardContent>
    </Card>
  );
};

export default Statcards;
