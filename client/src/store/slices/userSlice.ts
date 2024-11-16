import { userList } from "@/store/data/user-list";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userType {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  dob?: Date;
  email?: string;
  phone?: string;
  isLocked: boolean;
  permissions?: object;
}

const initialState: userType[] = userList;

export const userListSlice = createSlice({
  name: "user-list-slice",
  initialState,
  reducers: {
    setUsers: (_state, action: PayloadAction<userType[]>) => {
      return action.payload;
    },
    addUser: (state, action: PayloadAction<userType>) => {
      state.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<string>) => {
      return state.filter((user) => user._id !== action.payload);
    },
    updateUser: (state, action: PayloadAction<userType>) => {
      const index = state.findIndex((user) => user._id === action.payload._id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
  },
});

// Selector to get a user by ID
export const selectUserById = (state: { userList: userType[] }, id: string) => {
  return state.userList.find((user) => user._id === id);
};

// Export actions
export const { setUsers, addUser, removeUser, updateUser } =
  userListSlice.actions;

// Export reducer
export default userListSlice.reducer;
