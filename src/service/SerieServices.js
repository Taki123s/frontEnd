import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "./AuthServices";
import { jwtDecode } from "jwt-decode";
const SERIE_API_ADMIN_URL = "https://backend-w87n.onrender.com/admin/series";

const axiosInstance = axios.create({});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const getAllSerie = () => {
  return axiosInstance.get(SERIE_API_ADMIN_URL);
};
export const editSerie = (id, data) => {
  return axiosInstance.put(SERIE_API_ADMIN_URL + `/edit/${id}`, data);
};
export const deleteSerie = (id) => {
  return axiosInstance.delete(SERIE_API_ADMIN_URL + `/delete/${id}`);
};
export const addSerie = (data) => {
  return axiosInstance.post(SERIE_API_ADMIN_URL + "/add", data);
};
