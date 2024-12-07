import { EventType } from "@/store/slices/taskSlice";
import { Tooltip } from "@/components/custom ui/tooltip-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Activity,
  ArrowUpDown,
  CalendarClock,
  CircleAlert,
  Clock,
  Flag,
  UserRoundPen,
  UsersRound,
} from "lucide-react";
import moment from "moment";
import React, { ReactNode } from "react";
import { Badge } from "../ui/badge";
import { TaskForm } from "./task-form";

interface TaskDetailsProps {
  children: ReactNode;
  Event: EventType;
}

export function TaskDetails({ children, Event }: TaskDetailsProps) {
  const isEventRange = !moment(Event.start.toISOString()).isSame(
    Event.end.toISOString(),
    "day",
  );

  function formatDate(start: Date, end: Date) {
    const startMoment = moment(start);
    const endMoment = moment(end);

    if (!isEventRange) return `${startMoment.format("MMMM DD, YYYY dddd")}`;

    if (startMoment.isSame(endMoment, "month"))
      return `${startMoment.format("MMMM DD")} - ${endMoment.format("DD")}`;

    return `${startMoment.format("MMMM DD")} - ${endMoment.format("MMMM DD")}`;
  }

  const handleEventMark = (id: string) => {
    console.log(id);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{Event.title} </SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-[10%_90%] gap-2 items-start sm:items-center text-left text-sm text-muted-foreground my-6">
          <Tooltip content="Date" side="left">
            <CalendarClock className="mr-3" size={20} />
          </Tooltip>
          <div className="flex items-start sm:items-center gap-4 whitespace-nowrap flex-wrap">
            {formatDate(Event.start, Event.end)}{" "}
            {isEventRange ? (
              <span className="px-2 py-1 border-2 rounded-md stroke-wid whitespace-nowrap">
                All Day
              </span>
            ) : null}
          </div>
        </div>

        {!isEventRange ? (
          <div className="grid grid-cols-[10%_90%] gap-2 items-start text-left text-sm text-muted-foreground my-6">
            <Tooltip content="Timing" side="left">
              <Clock className="mr-3" size={20} />
            </Tooltip>
            {`${moment(Event.start).format("h:mm A")} - ${moment(Event.end).format("h:mm A")}`}
          </div>
        ) : null}

        <div className="grid grid-cols-[10%_90%] gap-2 items-start text-left text-sm text-muted-foreground my-6">
          <Tooltip content="Category" side="left">
            <Flag className="mr-3" size={20} />
          </Tooltip>
          {Event.category}
        </div>

        <div className="grid grid-cols-[10%_90%] gap-2 items-start text-left text-sm text-muted-foreground my-6">
          <Tooltip content="Priority" side="left">
            <ArrowUpDown className="mr-3" size={20} />
          </Tooltip>
          {Event.priority}
        </div>

        <div className="grid grid-cols-[10%_90%] gap-2 items-start text-left text-sm text-muted-foreground my-6">
          <Tooltip content="Status" side="left">
            <Activity className="mr-3" size={20} />
          </Tooltip>
          {Event.status}
        </div>

        <div className="grid grid-cols-[10%_90%] gap-2 items-start text-left text-sm text-muted-foreground my-6">
          <Tooltip content="Assigned By" side="left">
            <UserRoundPen className="mr-3" size={20} />
          </Tooltip>
          {Event.assignedBy}
        </div>

        <div className="grid grid-cols-[10%_90%] gap-2 items-start text-left text-sm text-muted-foreground my-6">
          <Tooltip content="Participants" side="left">
            <UsersRound className="mr-3" size={20} />
          </Tooltip>
          <div className="flex gap-1 flex-wrap whitespace-nowrap">
            {Event.participants.map((participant, index) => (
              <React.Fragment key={index}>
                <Badge variant="primary">{participant}</Badge>
              </React.Fragment>
            ))}
          </div>
        </div>

        <SheetDescription className="grid grid-cols-[10%_90%] gap-2 items-start text-left">
          <Tooltip content="Description" side="left">
            <CircleAlert className="mr-3" size={20} />
          </Tooltip>
          {Event.description}
        </SheetDescription>

        <SheetFooter className="gap-2 mt-8 sm:gap-0 sm:mt-6">
          <SheetClose asChild>
            <TaskForm initialEvent={Event}>
              <Button variant="secondary">Edit</Button>
            </TaskForm>
          </SheetClose>
          {Event.status === "Incomplete" ? (
            <SheetClose asChild>
              <Button
                variant="default"
                onClick={() => handleEventMark(Event.id)}
              >
                Mark Completed
              </Button>
            </SheetClose>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
