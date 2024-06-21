import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "./AuthServices";
import { jwtDecode } from "jwt-decode";

const USER_API_ADMIN_URL = "https://backend-w87n.onrender.com/admin/user";

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
export const getAllUser = () => {
  return axiosInstance.get(USER_API_ADMIN_URL);
};
export const editUser = (id, data) => {
  return axiosInstance.patch(USER_API_ADMIN_URL + `/${id}`, data);
};
export const deleteUser = (id) => {
  return axiosInstance.patch(USER_API_ADMIN_URL + `/delete/${id}`);
};
export const addUser = (data) => {
  return axiosInstance.post(USER_API_ADMIN_URL, data);
};
export const lockUser = (id) => {
  return axiosInstance.patch(USER_API_ADMIN_URL + `/deactivate/${id}`);
};
