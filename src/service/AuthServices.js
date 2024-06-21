import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const AUTH_API_BASE_URL = "https://backend-w87n.onrender.com/auth";

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
export const login = (user) => axios.post(AUTH_API_BASE_URL + "/login", user);
export const logout = (token) =>
  axiosInstance.post(AUTH_API_BASE_URL + "/logout", token);
export const register = (verifyUser) =>
  axios.post(AUTH_API_BASE_URL + "/register", verifyUser);
export const checkUsername = (username) =>
  axiosInstance.get(AUTH_API_BASE_URL + "/username", {
    params: { userName: username },
  });
export const sendMail = (userRegister) =>
  axiosInstance.post(AUTH_API_BASE_URL + "/email", userRegister);

export const refreshToken = (oldToken) => {
  return axios
    .post(AUTH_API_BASE_URL + "/refresh", { token: oldToken })
    .then((response) => {
      const newToken = response.data.accessToken;
      Cookies.set("jwt_token", newToken);
      return newToken;
    })
    .catch((error) => {
      Cookies.remove("jwt_token");
      return Promise.reject(error);
    });
};
