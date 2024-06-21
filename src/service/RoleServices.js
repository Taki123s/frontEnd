import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "./AuthServices";
import { jwtDecode } from "jwt-decode";
const ROLE_API_BASE_URL = "https://backend-w87n.onrender.com/admin/roles";

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
export const getRoles = () => {
  return axiosInstance.get(ROLE_API_BASE_URL);
};
export const getRoleById = (roleId) => {
  return axiosInstance.get(ROLE_API_BASE_URL + `/${roleId}`);
};
export const getEnablePermission = (roleId) => {
  return axiosInstance.get(ROLE_API_BASE_URL + `/${roleId}/permissions`);
};
export const addRolePermission = (roleId, permissionId) => {
  return axiosInstance.put(ROLE_API_BASE_URL + `/${roleId}/${permissionId}`);
};
export const editRole = (roleId, data) => {
  return axiosInstance.put(ROLE_API_BASE_URL + `/${roleId}`, data);
};
export const addRole = (data) => {
  return axiosInstance.post(ROLE_API_BASE_URL, data);
};
export const deleteRolePermission = (roleId, permissionId) => {
  return axiosInstance.delete(ROLE_API_BASE_URL + `/${roleId}/${permissionId}`);
};
export const deleteUserRole = (roleId, userId) => {
  return axiosInstance.delete(
    ROLE_API_BASE_URL + `/delete/userRole/${roleId}/${userId}`
  );
};
export const deleteRole = (roleId) => {
  return axiosInstance.delete(ROLE_API_BASE_URL + `/delete/${roleId}`);
};

export const getUsersNotHaveRole = (roleId) => {
  return axiosInstance.get(ROLE_API_BASE_URL + `/${roleId}/not`);
};
export const addRoleUser = (roleId, userId) => {
  return axiosInstance.post(ROLE_API_BASE_URL + `/${roleId}/user/${userId}`);
};
