import { EventType } from "@/components/calendar/calendarFunc";

//-----Categroy related functions-----
// Get unique categories from the events
export const getUniqueCategories = (events: EventType[]): string[] => {
  return [...new Set(events.map((event) => event.category))];
};

// Save categories
export const saveCategoryFunc = (
  Category: string[],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setCategories(Category);
};

// Delete a category
export const deleteCategoryFunc = (
  Category: string,
  categories: string[],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const updatedCategories = categories.filter((cat) => cat !== Category);
  setCategories(updatedCategories);
};

//-----Filter Funtions-----
export const filterCategoryFunc = (
  events: EventType[],
  selectedCategories: string[],
  setFilteredEvents: React.Dispatch<React.SetStateAction<EventType[]>>,
  filteredEvents: EventType[]
) => {
  if (!selectedCategories.length) {
    if (filteredEvents.length !== events.length) {
      setFilteredEvents(events);
    }
    return;
  }

  const filtered = events.filter((event) => selectedCategories.includes(event.category));

  if (filtered.length !== filteredEvents.length) {
    setFilteredEvents(filtered);
  }
};

export const filterPriorityFunc = (
  events: EventType[],
  selectedPriorities: string[],
  setFilteredEvents: React.Dispatch<React.SetStateAction<EventType[]>>,
  filteredEvents: EventType[]
) => {
  if (!selectedPriorities.length) {
    if (filteredEvents.length !== events.length) {
      setFilteredEvents(events);
    }
    return;
  }

  const filtered = events.filter((event) => selectedPriorities.includes(event.priority));

  if (filtered.length !== filteredEvents.length) {
    setFilteredEvents(filtered);
  }
};

export const filterStatusFunc = (
  events: EventType[],
  selectedStatus: string[],
  setFilteredEvents: React.Dispatch<React.SetStateAction<EventType[]>>,
  filteredEvents: EventType[]
) => {
  if (!selectedStatus.length) {
    if (filteredEvents.length !== events.length) {
      setFilteredEvents(events);
    }
    return;
  }

  const filtered = events.filter((event) => selectedStatus.includes(event.status));

  if (filtered.length !== filteredEvents.length) {
    setFilteredEvents(filtered);
  }
};
