import moment from "moment";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip } from "@/components/custom ui/tooltip-provider";
import { ToggleGroup } from "@/components/custom ui/toggle-group";
import React from "react";
import { cn } from "@/lib/utils";

import { useState, useCallback, useMemo } from "react";
import { Calendar } from "./calendar";
import { MiniCalendar } from "./mini-calendar";
import { EventType } from "@/store/slices/taskSlice";
import { Views } from "react-big-calendar";

type Keys = keyof typeof Views;

interface ShadcnCalProps extends React.HTMLAttributes<HTMLElement> {
  events: EventType[];
}

export const ShadcnCal: React.FC<ShadcnCalProps> = ({
  events,
  className,
  ...props
}) => {
  // useStates
  const [view, setView] = useState<(typeof Views)[Keys]>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const options = [
    { label: "Month", value: "month" },
    { label: "Week", value: "week" },
    { label: "Day", value: "day" },
    { label: "List", value: "agenda" },
  ];

  const goToToday = () => {
    setDate(new Date());
  };

  const prevClick = useCallback(() => {
    if (view === Views.DAY) setDate(moment(date).subtract(1, "d").toDate());
    if (view === Views.WEEK) setDate(moment(date).subtract(1, "w").toDate());
    if (view === Views.MONTH) setDate(moment(date).subtract(1, "M").toDate());
    if (view === Views.AGENDA) setDate(moment(date).subtract(1, "M").toDate());
  }, [view, date]);

  const nextClick = useCallback(() => {
    if (view === Views.DAY) setDate(moment(date).add(1, "d").toDate());
    if (view === Views.WEEK) setDate(moment(date).add(1, "w").toDate());
    if (view === Views.MONTH) setDate(moment(date).add(1, "M").toDate());
    if (view === Views.AGENDA) setDate(moment(date).add(1, "M").toDate());
  }, [view, date]);

  const dateText = useMemo(() => {
    if (view === Views.DAY) return moment(date).format("dddd, MMMM DD");
    if (view === Views.WEEK) {
      const from = moment(date)?.startOf("week");
      const to = moment(date)?.endOf("week");

      if (from.isSame(to, "month"))
        return `${from.format("MMMM DD")} - ${to.format("DD")}`;
      return `${from.format("MMMM DD")} - ${to.format("MMMM DD")}`;
    }
    if (view === Views.MONTH) return moment(date).format("MMMM YYYY");
    if (view === Views.AGENDA) {
      const from = moment(date);
      const to = moment(date).add(30, "d"); //Adding 30day for 30days gap in agenda view
      if (from.isSame(to, "year"))
        return `${from.format("DD MMMM")} - ${to.format("DD MMMM")}`;
      return `${from.format("DD MMMM YYYY")} - ${to.format("DD MMMM YYYY")}`;
    }
  }, [view, date]);

  const isDifferentYear =
    view === Views.AGENDA
      ? !moment(date).isSame(moment(date).add(30, "d"), "year")
      : false;

  const handleSetValue = (value: string) => {
    setView(value as "month" | "week" | "work_week" | "day" | "agenda");
  };

  return (
    <Card
      className={cn(
        "w-full h-full p-2 flex justify-center items-center flex-col gap-4",
        className,
      )}
      {...props}
    >
      <CardHeader className="flex w-full flex-row justify-around sm:justify-between flex-wrap items-center gap-4 text-xl border-b-2 lg:max-h-24">
        <div id="cal-controls" className="flex items-center gap-3">
          <Tooltip content="Go to today's date">
            <Button size="icon" onClick={() => goToToday()}>
              <CalendarClock />
            </Button>
          </Tooltip>
          <Tooltip content="Go to previous month">
            <Button size="icon" onClick={() => prevClick()}>
              <ChevronLeft />
            </Button>
          </Tooltip>
          <Tooltip content="Go to next month">
            <Button size="icon" onClick={() => nextClick()}>
              <ChevronRight />
            </Button>
          </Tooltip>
        </div>

        <CardTitle
          className={` ${
            !isDifferentYear ? "whitespace-nowrap" : "text-center"
          } font-bold text-[clamp(1.2rem,2vw,1.5rem)]`}
        >
          {dateText}
        </CardTitle>

        <div className="flex gap-4">
          <ToggleGroup
            defaultValue={view}
            value={view}
            setValue={handleSetValue}
            options={options}
          />
        </div>
      </CardHeader>

      <CardContent
        className={`hidden md:block w-full  md:h-[85vh] ${
          view == "month" ? "xl:h-full" : "xl:h-[85%]"
        }`}
      >
        <Calendar
          events={events} //custom event is passed directly onthe Calendar component
          defaultView="month"
          view={view}
          onView={handleSetValue}
          onNavigate={setDate}
          toolbar={false}
          date={date}
          // min={moment("2024-08-10T09:00:00").toDate()}
          // max={moment("2024-08-10T23:00:00").toDate()}
        />
      </CardContent>
      <CardContent className={`px-2 md:hidden w-full`}>
        <MiniCalendar date={date} events={events} view={view} />
      </CardContent>
    </Card>
  );
};
