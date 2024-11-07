import "./big-calendar.scss";
import {
  Calendar as BigCalendar,
  CalendarProps,
  EventProps,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import { EventType, setEventColor } from "./calendarFunc";
import { TaskDetails } from "../task/task-detail";
import { Tooltip } from "@/components/custom ui/tooltip-provider";

const localizer = momentLocalizer(moment);
type Keys = keyof typeof Views;

interface CustomCalendarProps extends Omit<CalendarProps<EventType>, "localizer" | "components"> {
  events?: EventType[];
  view?: (typeof Views)[Keys];
  onView?: (view: string) => void;
  onNavigate?: (date: Date) => void;
  date?: Date;
}

export function Calendar({
  events = [],
  view = "month",
  onView,
  onNavigate,
  date,
  ...restProps
}: CustomCalendarProps) {
  return (
    <BigCalendar
      localizer={localizer}
      components={{
        month: {
          event: CustomEventComponent,
          dateHeader: (headerProps) => (
            <CustomDateHeader {...headerProps} setView={onView} setDate={onNavigate} />
          ),
        },
        week: { event: CustomEventComponent, header: CustomDateHeader },
        day: { event: CustomEventComponent },
        agenda: { event: CustomEventComponent },
      }}
      events={events}
      defaultView="month"
      view={view}
      onView={onView}
      onNavigate={onNavigate}
      toolbar={false}
      tooltipAccessor={null}
      date={date}
      {...restProps}
    />
  );
}

const CustomEventComponent = ({ event }: EventProps<EventType>) => {
  const title = event?.title;
  const isDayEvent = moment(event.start).isSame(moment(event.end), "day");
  const tooltipContent = isDayEvent
    ? `${moment(event.start).format("h:mm A")} - ${moment(event.end).format("h:mm A")} : ${title}`
    : `${title}`;

  return (
    <TaskDetails Event={event}>
      <span>
        <Tooltip content={tooltipContent}>
          <div
            className={`${setEventColor(
              event
            )} h-full flex items-center text-center rounded-sm py-0.5 px-2 font-semibold text-sm text-white`}
          >
            {title}
          </div>
        </Tooltip>
      </span>
    </TaskDetails>
  );
};

const CustomDateHeader = ({
  label,
  date,
  setView,
  setDate,
}: {
  label: string;
  date: Date;
  setView?: (view: string) => void;
  setDate?: (date: Date) => void;
}) => {
  const isToday = moment(date).isSame(moment(), "day");

  const handleClick = (date: Date) => {
    if (setView) setView(Views.DAY);
    if (setDate) setDate(date);
  };

  return (
    <div onClick={() => handleClick(date)}>
      <span className={`${isToday ? "text-blue-400" : ""}`}>{label}</span>
    </div>
  );
};
