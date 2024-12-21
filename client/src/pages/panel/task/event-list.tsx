import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { EventType } from "@/utils/types/task";
import { setEventColor } from "@/components/calendar/calendarFunc";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/custom ui/tooltip-provider";
import { Plus } from "lucide-react";
import moment from "moment";
import { TaskForm } from "./task-form";
import { TaskDetails } from "./task-detail";

interface EventListProps extends React.HTMLAttributes<HTMLElement> {
  Events: EventType[];
  createEventAccess?: boolean;
}

const upcomingEvents = (Events: EventType[]) => {
  const today = new Date();

  return Events.filter(
    (event) => event.start >= today && event.status === "Incomplete",
  )
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 3);
};

export const EventList: React.FC<EventListProps> = ({
  Events,
  createEventAccess = false,
  className,
  ...props
}) => {
  const newEvents = upcomingEvents(Events);

  return (
    <Card className={cn("h-full min-w-60 w-full", className)} {...props}>
      <CardHeader className="flex flex-row justify-around items-center flex-wrap sm:justify-between gap-6 text-xl border-b-2">
        <CardTitle className="w-auto text-lg flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Upcoming Events
        </CardTitle>

        {createEventAccess && (
          <TaskForm>
            <Button variant="outline" size="icon">
              <Tooltip content="Create New Event" side="bottom">
                <Plus className="h-5 w-5" />
              </Tooltip>
            </Button>
          </TaskForm>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {newEvents.map((event, index) => (
          <React.Fragment key={index}>
            {eventBody(event)}
            {index < newEvents.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

const eventBody = (event: EventType) => (
  <TaskDetails Event={event}>
    <div className="p-4 py-2 flex gap-4 items-baseline rounded-md hover:bg-muted">
      <div
        className={`h-2 w-2 rounded-full col-span-1 ${setEventColor(event)}`}
      ></div>
      <div>
        <div className="font-semibold text-foreground/60 text-sm">
          {`${formattedDate(event.start, event.end)}`}
        </div>
        <div className="text-base">{event.title}</div>
      </div>
    </div>
  </TaskDetails>
);

const formattedDate = (start: Date, end: Date) => {
  const eventStart = moment(start);
  const eventEnd = moment(end);

  const eventDate = eventStart.isSame(moment(), "day")
    ? "Today"
    : eventStart.isSame(moment().add(1, "day"), "day")
      ? "Tomorrow"
      : eventStart.format("Do MMM");

  const eventTime = eventStart.isSame(eventEnd, "day")
    ? `${eventStart.format("hh:mm A")} - ${eventEnd.format("hh:mm A")}`
    : `${eventStart.format("hh:mm A")} - All Day`;

  return `${eventDate} ${eventTime}`;
};
