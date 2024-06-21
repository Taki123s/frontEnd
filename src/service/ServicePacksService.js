import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "./AuthServices";
import { jwtDecode } from "jwt-decode";
const MOVIE_API_BASE_URL = "https://backend-w87n.onrender.com/admin/servicePack";
const MOVIE_API_BASE_URL_CLIENT = "https://backend-w87n.onrender.com/servicePack";
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
export const getServiceList = () => {
  return axiosInstance.get(MOVIE_API_BASE_URL);
};
export const getUserPackedList = () => {
  return axiosInstance.get(`${MOVIE_API_BASE_URL}/getAll`);
};
export const getUserPackedListByUser = (idUser) => {
  return axiosInstance.get(`${MOVIE_API_BASE_URL_CLIENT}/getAll/${idUser}`);
};
export const editServicePack = (id, updatedService) => {
  return axiosInstance.put(`${MOVIE_API_BASE_URL}/${id}`, updatedService);
};
export const deleteServicePack = (id, updatedService) => {
  return axiosInstance.put(`${MOVIE_API_BASE_URL}/delete/${id}`);
};
export const deleteUserPacked = (id) => {
  return axiosInstance.put(`${MOVIE_API_BASE_URL}/delete/user-packed/${id}`);
};
export const createServicePack = (Service) => {
  return axiosInstance.post(`${MOVIE_API_BASE_URL}/create`, Service, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
