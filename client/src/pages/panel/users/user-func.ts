import { AppDispatch, RootState } from "@/store";
import { addUser, removeUser, updateUser } from "@/store/slices/userSlice";
import { userType } from "@/utils/types/user";
import { useSelector } from "react-redux";

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

export const editUser = (user: userType, dispatch: AppDispatch) => {
  dispatch(updateUser(user));
};

export const deleteUser = (userID: string, dispatch: AppDispatch) => {
  dispatch(removeUser(userID));
};
