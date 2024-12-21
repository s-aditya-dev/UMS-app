import axios from "axios";

const backEndPort = "http://localhost:3000";

const newRequest = axios.create({
  baseURL: `${backEndPort}/api/`,
  withCredentials: true,
});

export default newRequest;
