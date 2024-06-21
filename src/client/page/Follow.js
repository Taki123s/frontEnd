import React, { useState, useEffect } from "react";

import { AiOutlineMore } from "react-icons/ai";
import MovieFollowItem from "./MovieFollowItem.js"; // Import MovieComment component
import "../../css/follow.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { API_GET_PATHS } from "../../service/Constant.js";
import { useTranslation, Trans } from "react-i18next";

function Follow() {
  const [listmovie, setListMovie] = useState([]); // Ensure initial state is an array
  const [error, setError] = useState(null); // State to handle errors
  const { t } = useTranslation();

  var token = Cookies.get("jwt_token");

  const user = typeof token === "undefined" ? null : jwtDecode(token);
  const handleRefresh = () => {
    fetchMovies();
  };

  const fetchMovies = async () => {
    const response = await fetch(
      API_GET_PATHS.GET_LIST_MOVIE_FOLLOWED_API_ADMIN_URL + `${user.idUser}`
    ); // Correct usage of template literals

    const data = await response.json();

    setListMovie(data);
  };
  useEffect(() => {
    // Fetch the movie list from the API

    fetchMovies();
  }, []);
  if (listmovie.length == 0) {
    return <div>{t("follow.emptylist")}</div>;
  }
  if (error) {
    return <div>{t("follow.error")}: {error}</div>;
  }
  if (!user) {
    return <div>{t("follow.login_error")}</div>;
  }
  return (
    <section className="follow_page">
      <br></br>
      <h2  style={{"text-transform": "uppercase"}} className="title_movie_follow">               
       {t("follow.favoritemovielist")}
      </h2>
      <br></br>
      <div className="element">
        <div className="title_element row">
          <span className="image_movie col-md-3"> {t("follow.image")}</span>
          <span className="title_movie col-md-3"> {t("follow.moviename")}</span>
          <span className="movie_time col-md-3">{t("follow.time")}</span>
          <span className="movie_viewer col-md-3">{t("follow.view")}</span>
          <span className="movie_icon col-md-3">
            <AiOutlineMore />
          </span>
        </div>
        <div className="movie_element_list">
          {listmovie.map((movie) => (
            <MovieFollowItem
              key={movie.id}
              movie={movie}
              user={user}
              onRefresh={handleRefresh}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export default Follow;
