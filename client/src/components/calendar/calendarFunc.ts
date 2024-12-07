import moment from "moment";
import { EventType } from "@/store/slices/taskSlice";

export function setEventColor(event: EventType) {
  if (event.status == "Canceled") return "bg-red-800 line-through decoration-2";
  if (event.status == "Complete") {
    if (event.priority === "Low") return "bg-green-200 !text-green-700/80";
    if (event.priority === "Medium") return "bg-amber-200 !text-amber-700/80";
    if (event.priority === "High") return "bg-red-200 !text-red-700/80";
  }
  if (event.priority === "Low") return "bg-green-500";
  if (event.priority === "Medium") return "bg-amber-500";
  if (event.priority === "High") return "bg-red-500";
  return "";
}

export function handleEventClick(id: string) {
  console.log(id);
}

export const getEventsForDate = (
  date: Date,
  events: EventType[],
): EventType[] => {
  const targetDate = moment(date).startOf("day");

  return events.filter((event) => {
    const eventStart = moment(event.start).startOf("day");
    const eventEnd = moment(event.end).endOf("day");

    return (
      eventStart.isSame(targetDate) ||
      eventEnd.isSame(targetDate) ||
      (eventStart.isBefore(targetDate) && eventEnd.isAfter(targetDate))
    );
  });
};

export const getEventsByRange = (
  date: Date,
  events: EventType[],
  view: string,
): { [key: string]: EventType[] } => {
  let startOfPeriod: moment.Moment;
  let endOfPeriod: moment.Moment;

  if (view === "month") {
    startOfPeriod = moment(date).startOf("month");
    endOfPeriod = moment(date).endOf("month");
  } else if (view === "week") {
    startOfPeriod = moment(date).startOf("week");
    endOfPeriod = moment(date).endOf("week");
  } else if (view === "day") {
    startOfPeriod = moment(date).startOf("day");
    endOfPeriod = moment(date).endOf("day");
  } else if (view === "agenda") {
    startOfPeriod = moment(date).startOf("day");
    endOfPeriod = moment(date).add(30, "d");
  } else {
    // Default case if the view is not recognized
    return {};
  }

  const eventsByDate: { [key: string]: EventType[] } = {};
  const currentDate = startOfPeriod.clone();

  while (currentDate.isBefore(endOfPeriod)) {
    const day = currentDate.format("YYYY-MM-DD");
    eventsByDate[day] = getEventsForDate(currentDate.toDate(), events);
    currentDate.add(1, "day");
  }

  return eventsByDate;
};
