import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "./AuthServices";
import { jwtDecode } from "jwt-decode";

const GENRE_API_BASE_URL = "https://backend-w87n.onrender.com/genre";
const GENRE_API_ADMIN_URL = "https://backend-w87n.onrender.com/admin/genres";
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
export const getGenreList = () => {
  return axiosInstance.get(GENRE_API_BASE_URL);
};
export const getAdminGenre = () => {
  return axiosInstance.get(GENRE_API_ADMIN_URL);
};
export const getMoviesByGenre = (idGenre, currentPage, sortBy, ascending) => {
  return axiosInstance.get(GENRE_API_BASE_URL + "/movies", {
    params: {
      idGenre: idGenre,
      page: currentPage,
      sortBy: sortBy,
      ascending: ascending,
    },
  });
};

export const getAllGenre = () => {
  return axiosInstance.get(GENRE_API_ADMIN_URL);
};
export const addGenre = (data) => {
  return axiosInstance.post(GENRE_API_ADMIN_URL, data);
};
export const editGenre = (genreId, data) => {
  return axiosInstance.put(GENRE_API_ADMIN_URL + `/${genreId}`, data);
};
export const deleteGenre = (genreId) => {
  return axiosInstance.delete(GENRE_API_ADMIN_URL + `/${genreId}`);
};
