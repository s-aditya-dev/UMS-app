import { AppDispatch, RootState } from "@/store";
import { addUser, userType } from "@/store/slices/userSlice";
import { useSelector } from "react-redux";
export const generateUniqueId = () => {
  const chars = "abcdef0123456789";
  let id = "";
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};

export const generateUsername = (firstName: string) => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  return `${firstName}${randomDigits}`;
};

export const generatePassword = () => {
  return Math.random().toString(36).slice(-8); // Generates random 8-char password
};

export const getUsers = () => {
  const users = useSelector((state: RootState) => state.userList);
  return users;
};

export const createUser = (user: userType, dispatch: AppDispatch) => {
  dispatch(addUser(user));
};
