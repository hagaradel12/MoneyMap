import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // this must match your backend
  withCredentials: true, // if you're using cookies/sessions
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
