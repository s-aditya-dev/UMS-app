import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { events } from "../data/events";

import { EventType, TaskState } from "@/utils/types/task";

const initialState: TaskState = {
  TaskInitialData: {
    categories: ["Exams", "Testing"],
    priorityList: ["High", "Medium", "Low"],
    statusList: ["Incomplete", "Complete"],
  },
  Events: events,
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.TaskInitialData.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<string>) => {
      state.TaskInitialData.categories.push(action.payload);
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.TaskInitialData.categories =
        state.TaskInitialData.categories.filter(
          (category) => category !== action.payload,
        );
    },
    setEvents: (state, action: PayloadAction<EventType[]>) => {
      state.Events = action.payload;
    },
    addEvent: (state, action: PayloadAction<EventType>) => {
      state.Events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<EventType>) => {
      const index = state.Events.findIndex(
        (event) => event.id === action.payload.id,
      );
      if (index !== -1) {
        state.Events[index] = action.payload;
      }
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.Events = state.Events.filter(
        (event) => event.id !== action.payload,
      );
    },
  },
});

// Export actions
export const {
  setCategories,
  addCategory,
  removeCategory,
  setEvents,
  addEvent,
  updateEvent,
  removeEvent,
} = taskSlice.actions;

// Export reducer
export default taskSlice.reducer;
