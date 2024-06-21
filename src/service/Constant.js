export const BASE_URL = "https://backend-w87n.onrender.com";

export const API_GET_PATHS = {
  GET_LIST_MOVIE_FOLLOWED_API_ADMIN_URL: `${BASE_URL}/movie/findAll?userId=`,
  GET_ALL_MOVIE: `${BASE_URL}/movie/`,
  GET_ALL_GENRE: `${BASE_URL}/genre`,
  GET_MOVIE_SAME: `${BASE_URL}/movie/same/`,
  GET_FOLLOW: `${BASE_URL}/follow`,
  GET_PROFILE: `${BASE_URL}/account/view/`,
  GET_ALL_SERVICE_PACK:`${BASE_URL}/servicePack/findAll`
};
export const API_POST_PATHS = {
  FOLLOW_MOVIE: `${BASE_URL}/follow/save`,
};
export const API_PATCH_PATHS = {
  CHANGE_PASSWORD: `${BASE_URL}/account/changePassword/`,
  EDIT_USER: `${BASE_URL}/admin/user/`,
  UPDATE_PROFILE: `${BASE_URL}/account/update`
};
