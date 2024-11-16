import { configureStore } from "@reduxjs/toolkit";
import userListReducer from "@/store/slices/userSlice";

const store = configureStore({
  reducer: {
    userList: userListReducer,
  },
  // Allow Date objects or other serializable values
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        isSerializable: (value: any) => {
          return typeof value === "object" && value instanceof Date
            ? true
            : typeof value !== "function";
        },
      },
    }),
});

// Export store and RootState, AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
