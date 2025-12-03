import { Users } from "lucide-react";

interface eventcardprops {
  title: string;
  category: string;
  time: string;
  attendees: number;
}

const categoryColors: Record<
  string,
  { hover: string; bg: string; text: string; linebg: string }
> = {
  Music: {
    hover: "hover:bg-orange-200",
    bg: "bg-orange-100",
    linebg: "bg-orange-700",
    text: "text-orange-700",
  },
  Business: {
    hover: "hover:bg-blue-200",
    bg: "bg-blue-100",
    linebg: "bg-blue-700",
    text: "text-blue-700",
  },
  Sports: {
    hover: "hover:bg-green-200",
    bg: "bg-green-100",
    linebg: "bg-green-700",
    text: "text-green-700",
  },
  Education: {
    hover: "hover:bg-purple-200",
    bg: "bg-purple-100",
    linebg: "bg-purple-700",
    text: "text-purple-700",
  },
};

const Eventcard = ({ title, category, time, attendees }: eventcardprops) => {
  const colors = categoryColors[category] || {
    hover: "hover:bg-gray-200",
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  return (
    <div className={`flex p-4 border-0 justify-between ${colors.hover}`}>
      <div className="flex gap-3">
        <div className={`h-full w-[2px] ${colors.linebg} `}></div>

        <div className="flex flex-col gap-1">
          <p className="text-bold">{title}</p>
          <p className="text-black/50">{time}</p>

          <div className="flex gap-2 text-black/50 items-center">
            <Users className="w-5 h-5" />
            <p>
              <span>{attendees}</span> attendees
            </p>
          </div>
        </div>
      </div>

      <span
        className={`px-3 py-1 h-max rounded-full flex items-center justify-center ${colors.bg} ${colors.text}`}
      >
        {category}
      </span>
    </div>
  );
};

export default Eventcard;
