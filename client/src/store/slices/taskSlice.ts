import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskState {
  categories: string[];
  priorityList: string[];
  statusList: string[];
}

const initialState: TaskState = {
  categories: [],
  priorityList: ["High", "Medium", "Low"],
  statusList: ["Incomplete", "Complete"],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<string>) => {
      state.categories.push(action.payload);
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((category) => category !== action.payload);
    },
  },
});

// Export actions
export const { setCategories, addCategory, removeCategory } = taskSlice.actions;

// Export reducer
export default taskSlice.reducer;
