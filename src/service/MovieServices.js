import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "./AuthServices";
const MOVIE_API_BASE_URL = "https://backend-w87n.onrender.com/movie";
const MOVIE_API_ADMIN_URL = "https://backend-w87n.onrender.com/admin/movies";

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

export const getMovieList = () => {
  return axiosInstance.get(MOVIE_API_BASE_URL);
};
export const findMovie = (id) => {
  return axiosInstance.get(MOVIE_API_BASE_URL + `/${id}`);
};
export const searchMovie = (term) => {
  return axiosInstance.get(MOVIE_API_BASE_URL + "/search?term=" + `${term}`);
};

export const findMovieWatching = (movieId, token) => {
  return axiosInstance.get(MOVIE_API_BASE_URL + "/watching", {
    params: { movieId: movieId, token: token },
  });
};
export const updateView = (movieId, token) => {
  return axiosInstance.post(MOVIE_API_BASE_URL + `/${movieId}`, token);
};
export const movieViewed = (idUser, token) => {
  return axiosInstance.get(MOVIE_API_BASE_URL +`/viewed`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { idUser }
  });
};
export const adminListMovie = () => {
  return axiosInstance.get(MOVIE_API_ADMIN_URL);
};
export const deleteMovie = (id) => {
  return axiosInstance.delete(MOVIE_API_ADMIN_URL + `/delete/${id}`);
};
export const addMovie = (data) => {
  return axiosInstance.post(MOVIE_API_ADMIN_URL + "/add", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getMovieChapters = (idMovie) => {
  return axiosInstance.get(MOVIE_API_ADMIN_URL + `/${idMovie}/chapters`);
};

export const uploadChapter = (idMovie, idChapter, data, onUploadProgress) => {
  return axiosInstance.put(
    `${MOVIE_API_ADMIN_URL}/${idMovie}/chapter/${idChapter}/editFile`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onUploadProgress,
    }
  );
};
export const addChapter = (idMovie, data) => {
  return axiosInstance.post(
    MOVIE_API_ADMIN_URL + `/${idMovie}/chapters`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const editChapter = (idMovie, idChapter, data) => {
  return axiosInstance.put(
    MOVIE_API_ADMIN_URL + `/${idMovie}/chapter/${idChapter}/edit`,
    data
  );
};
export const deleteChapter = (idMovie, idChapter) => {
  return axiosInstance.delete(
    MOVIE_API_ADMIN_URL + `/${idMovie}/chapter/${idChapter}`
  );
};

export const getMovieById = (idMovie) => {
  return axiosInstance.get(MOVIE_API_BASE_URL + `/${idMovie}`);
};
export const editMovie = (idMovie, data) => {
  return axiosInstance.put(MOVIE_API_ADMIN_URL + `/${idMovie}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
