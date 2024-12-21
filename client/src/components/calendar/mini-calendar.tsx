import * as React from "react";
import { cn } from "@/lib/utils";
import {
  getEventsByRange,
  setEventColor,
  handleEventClick,
} from "./calendarFunc";
import { EventType } from "@/utils/types/task";
import moment from "moment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskDetails } from "@/pages/panel/task/task-detail";

interface MiniCalendarProps extends React.HTMLAttributes<HTMLElement> {
  date: Date;
  events: EventType[];
  view: string;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  date,
  events,
  view,
  className,
  ...props
}) => {
  const eventsByDate = getEventsByRange(date, events, view);
  const hasEvents = Object.values(eventsByDate).some(
    (eventArray) => eventArray.length > 0,
  );

  return (
    <div
      className={cn("border rounded-lg overflow-hidden", className)}
      {...props}
    >
      <ScrollArea className="h-[450px]">
        {hasEvents ? (
          <table className="w-full">
            <tbody>
              {Object.keys(eventsByDate).map((day, index) =>
                eventsByDate[day].length > 0 ? (
                  <EventLayout
                    key={index}
                    events={eventsByDate[day]}
                    view={view}
                    date={day}
                  />
                ) : null,
              )}
            </tbody>
          </table>
        ) : (
          <div className="h-[450px] w-full flex items-center justify-center font-semibold">
            No events available for this {view}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

const EventLayout = ({
  date,
  events,
  view,
}: {
  date: string;
  events: EventType[];
  view: string;
}) => {
  return (
    <>
      <tr className="bg-muted/65 text-sm font-semibold text-primary/80 border-b">
        <td colSpan={2}>
          <div className="flex items-center justify-between px-4 py-2">
            {view === "month" ? (
              <>
                <span>{moment(date).format("MMM DD, YYYY")}</span>
                <span>{moment(date).format("dddd")}</span>
              </>
            ) : (
              <>
                <span>{moment(date).format("dddd")}</span>
                <span>{moment(date).format("MMM DD, YYYY")}</span>
              </>
            )}
          </div>
        </td>
      </tr>
      {events.map((event) => (
        <TaskDetails Event={event} key={event.id}>
          <tr
            key={event.id} // Use event.id as the key
            className="text-sm border-b hover:bg-muted/35"
            onClick={() => handleEventClick(event.id)}
          >
            <td className="px-4 py-2 text-center">
              {moment(event.start).isSame(event.end, "day")
                ? `${moment(event.start.toISOString()).format("h:mm A")}-${moment(
                    event.end.toISOString(),
                  ).format("h:mm A")}`
                : "All Day"}
            </td>
            <td className="px-4 py-2">
              <span className="flex items-center gap-3">
                <div
                  className={`shrink-0 h-2 w-2 rounded-full ${setEventColor(event)}`}
                ></div>
                <div>{event.title}</div>
              </span>
            </td>
          </tr>
        </TaskDetails>
      ))}
    </>
  );
};
