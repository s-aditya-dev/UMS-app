// utils/auth.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const token_name = "Access_Token";

export const getToken = () => {
  return Cookies.get(token_name); // or whatever name you're using for the cookie
};

export const getPayload = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isTokenValid = () => {
  const payload = getPayload();
  if (!payload) return false;

  // Check if token is expired
  const currentTime = Date.now() / 1000;
  return payload.exp > currentTime;
};

export const setToken = (token: any) => {
  Cookies.set(token_name, token, {
    expires: 7, // expires in 7 days
    secure: true, // only sent over HTTPS
    sameSite: "strict", // protection against CSRF
  });
};

export const removeToken = () => {
  Cookies.remove(token_name);
};
