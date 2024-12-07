import { useState, useEffect } from "react";
import styles from "@/scss/layout/TaskLayout.module.scss";
import { EventList } from "@/components/task/event-list";
import { events as initialEvent } from "@/store/data/events";
import { CategoriesFilter } from "@/components/task/categories";
import { ShadcnCal } from "@/components/calendar/Shadcn Calender";
import "react-big-calendar/lib/css/react-big-calendar.css"; //CSS import for styling calendar
import { EventType } from "@/store/slices/taskSlice";
import {
  getUniqueCategories,
  filterCategoryFunc,
  saveCategoryFunc,
  deleteCategoryFunc,
} from "@/components/task/taskHandlers";

export const Task = () => {
  //useStates
  const [events, setEvents] = useState<EventType[]>([]);
  const [taskPerms, setTaskPerms] = useState({
    createEventAccess: false,
    editEventAccess: false,
    editCategoryAccess: false,
  });
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [categories, setTaskCategories] = useState<string[]>([]);

  useEffect(() => {
    setEvents(initialEvent);
    setTaskPerms((prev) => ({
      ...prev,
      createEventAccess: true,
      editEventAccess: true,
      editCategoryAccess: true,
    }));
  }, []);

  useEffect(() => {
    setTaskCategories(getUniqueCategories(events));
  }, [events]);

  return (
    <div className={styles.TaskLayout}>
      <EventList
        className={styles.TaskEvents}
        Events={events}
        createEventAccess={taskPerms.createEventAccess}
      />
      <CategoriesFilter
        categorieList={categories}
        filterFunc={(selectedCategories) =>
          filterCategoryFunc(
            events,
            selectedCategories,
            setFilteredEvents,
            filteredEvents,
          )
        }
        editCategoryAccess={taskPerms.editCategoryAccess}
        saveFunc={(Category) => saveCategoryFunc(Category, setTaskCategories)}
        deleteFunc={(Category) =>
          deleteCategoryFunc(Category, categories, setTaskCategories)
        }
        className={styles.TaskCategory}
      />
      <ShadcnCal events={filteredEvents} className={styles.TaskCalendar} />
    </div>
  );
};
