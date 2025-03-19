import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://placementb.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
