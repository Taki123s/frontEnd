import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../../css/moviedetail.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { useTranslation, Trans } from "react-i18next";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Fix: Removed extra curly braces
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { LikeShare } from "../component/LikeShare";
import { Comment } from "../component/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { API_POST_PATHS, API_GET_PATHS } from "../../service/Constant.js";

function MovieDetail() {
  const { t,i18n  } = useTranslation();
  const token = Cookies.get("jwt_token"); // Fix: Changed var to const and removed redundant typeof check
  const user = token ? jwtDecode(token) : null;
  const { id } = useParams();
  const [movie, setMovies] = useState({});
  const [movieSameSeries, setMovieSameSeries] = useState([]);
  const [flag, setFlag] = useState(false);
  const [follow, setFollow] = useState("");
  const [isFavorite, setFavorite] = useState("");
  const [rating, setRating] = useState(0); // State to store the user's rating
  const [hoverRating, setHoverRating] = useState(0); // State to store the hover rating
  const [averageRating, setAverageRating] = useState(0); // State to store the average rating
  const [description, setDescription] = useState("");

  const currentUrl = `http://animeweb.site/like/${id}`;

  const starColor = (index) => {
    if (index <= rating) {
      return "#ffdd00"; // Tô màu vàng cho các sao đã được đánh giá
    } else if (index <= hoverRating) {
      return "#ffdd00"; // Tô màu vàng khi di chuột qua sao
    } else {
      return "#ccc"; // Màu xám cho các sao chưa được đánh giá
    }
  };

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const response = await axios.get(API_GET_PATHS.GET_ALL_MOVIE + `${id}`);
        setMovies(response.data);
        console.log(i18n.language)
        if(i18n.language =="en"){
          setDescription(response.data.englishDescriptions);
        }else{
         setDescription(response.data.vietnameseDescriptions);

        }
      

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          API_GET_PATHS.GET_MOVIE_SAME + `${id}`
        );
        console.log(response.data);
        setMovieSameSeries(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    if (user) {
      const fetchFollowData = async () => {
        try {
          const response = await axios.get(
            API_GET_PATHS.GET_FOLLOW + `?movieId=${id}&userId=${user.idUser}`
          );
          if (response.data) {
            setFollow(response.data);
            setFavorite(response.data.status);
          }
        } catch (error) {
          console.error("Error fetching follow data:", error);
        }
      };
      fetchFollowData();
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchRating = async () => {
        try {
          const response = await axios.get(
            API_GET_PATHS.GET_RATE+`/${user.idUser}/movie/${id}`
          );
          console.log(response);
          if (response.data) {
            setRating(response.data);
          }
        } catch (error) {
          console.error("Error fetching rating:", error);
        }
      };
      fetchRating();
    }
  }, []);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(API_GET_PATHS.GET_AVERAGE_RATE
          `/${id}`
        );
        if (response.data) {
          setAverageRating(response.data);
        }
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };
    fetchAverageRating();
  }, [rating]);

  const ShowMore = () => {
    setFlag(!flag);
    return flag;
  };

  const AddFavorite = () => {
    if (user) {
      const newFavorite = !isFavorite;
      setFavorite(newFavorite);
      const currentDate = new Date().toISOString();
      const newFollow = {
        followAt: currentDate,
        status: newFavorite,
        userId: user.idUser,
        movieId: movie.id,
      };
      axios
        .post(API_POST_PATHS.FOLLOW_MOVIE, newFollow)
        .then((response) => {})
        .catch((error) => {
          console.error("Error posting follow:", error);
          setFavorite(!isFavorite);
        });
    } else {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <p>Vui lòng đăng nhập!</p>
            </div>
          );
        },
      });
    }
  };

  const handleRating = async (ratingValue) => {
    if (user) {
      const newRating = {
        score: ratingValue,
        userId: user.idUser,
        movieId: movie.id,
      };
      try {
        await axios.post(API_POST_PATHS.VOTE_MOVIE, newRating, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setRating(ratingValue);
      } catch (error) {
        console.error("Error saving rating:", error);
      }
    } else {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <p>Vui lòng đăng nhập!</p>
            </div>
          );
        },
      });
    }
  };

  return (
    <div className="supermovie">
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <i className="fas fa-home" style={{ color: "#000000" }}></i>
                <Link to="/">
                  <Trans i18nKey={"menu.home"}>{t("menu.home")}</Trans>
                </Link>
                <Link to="">
                  <Trans i18nKey={"content.moviedetail"}>
                    {t("content.moviedetail")}
                  </Trans>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="anime__details__content">
            <div className="row">
              <div className="col-lg-9">
                <div className="anime_details_title">
                  <h3 className=".text-primary-emphasis">{movie.name}</h3>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <div className="image-container">
                  <img
                    className="movie-image"
                    src={movie.avatarMovie}
                    alt="movie"
                  />

                  <div className="anime__details__btn icon-layer">
                    <div className="circular-rating">
                      {averageRating.toFixed(1)}
                    </div>
                    {isFavorite ? (
                      <FaHeart
                        onClick={AddFavorite}
                        style={{ color: "red", fontSize: "25px" }}
                      />
                    ) : (
                      <FaRegHeart
                        onClick={AddFavorite}
                        style={{ color: "black", fontSize: "25px" }}
                      />
                    )}
                  </div>

                  <div className="star-rating">
                    {[...Array(10)].map((_, index) => {
                      index += 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={index}
                            onClick={() => handleRating(index)}
                            style={{ display: "none" }}
                          />
                          <span
                            className="star"
                            onMouseEnter={() => setHoverRating(index)}
                            onMouseLeave={() => setHoverRating(rating)}
                            style={{
                              color: index <= rating ? "#ffdd00" : "#ccc",
                            }} // Sử dụng rating để xác định màu của sao
                          >
                            &#9733;
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div
                    className="btn-group btn-group-toggle"
                    data-toggle="buttons"
                  >
                    {movieSameSeries.map((sameMovie, index) => (
                      <Link to={`/movie/${sameMovie.id}`}>
                        {" "}
                        <button
                          key={index}
                          type="button"
                          className="btn btn-secondary"
                        >
                          {sameMovie.seriesDescriptions}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="row">
                  <div className="anime__details__btn">
                    <Link
                      className="watch-btn"
                      to={`/movie/watching/${movie.id}/${1}`}
                    >
                      <div className="d-flex align-items-center">
                        <button
                          id={"rateBtn"}
                          style={{
                            color: "white",
                            fontSize: "20px",
                            outline: "none",
                          }}
                        >
                          Watching
                        </button>
                        <i>
                          <FontAwesomeIcon icon={faAngleRight} />
                        </i>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-9">
                <div
                  className="anime__details__widget"
                  style={{ height: "100%" }}
                >
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <ul>
                        <li>
                          <span>
                            <Trans i18nKey={"menu.categories"}>
                              {t("menu.categories")}
                            </Trans>
                            :
                          </span>
                          {movie.genres?.map((genre) => (
                            <Link
                              key={genre.id}
                              to={`/categories/${genre.id}/${genre.description}`}
                            >
                              <button
                                className="btn btn-outline-danger ml-2 hoverWhite"
                                style={{
                                  color: "black",
                                  fontWeight: "500",
                                  marginTop: "10px",
                                  transform: "translate(-10%,-20%)",
                                }}
                              >
                                {genre.description}
                              </button>
                            </Link>
                          ))}
                        </li>
                        <li>
                          <span>
                            <Trans i18nKey={"content.producer"}>
                              {t("content.producer")}
                            </Trans>
                          </span>
                          <span style={{ width: "unset", fontWeight: "400" }}>
                            {movie.producer}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <ul>
                        <li style={{ display: "flex" }}>
                          <span>
                            <Trans i18nKey={"content.duration"}>
                              {t("content.duration")}
                            </Trans>
                          </span>
                          <span style={{ width: "unset", fontWeight: "400" }}>
                            24 min/ep
                          </span>
                        </li>
                        <li>
                          <span>
                            <Trans i18nKey={"content.quality"}>
                              {t("content.quality")}
                            </Trans>
                          </span>
                          <span style={{ width: "unset", fontWeight: "400" }}>
                            HD
                          </span>
                        </li>
                        <li>
                          <span>
                            <Trans i18nKey={"content.views"}>
                              {t("content.views")}
                            </Trans>
                          </span>
                          <span style={{ width: "unset", fontWeight: "400" }}>
                            {movie.views?.length}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-9 anime_showmore">
                      <div className="anime__details__text">
                        <div className="anime_details_title"></div>

                        {flag === false &&
                        description !== null &&
                        description.length > 500 ? (
                          <>
                            <h4 className="des_detail">
                              {description.substring(0, 500)}
                            </h4>
                            <a onClick={() => ShowMore()}>
                              <i>{t("content.showmore")}</i>
                            </a>
                          </>
                        ) : (
                          <>
                            <h4 className="des_detail">
                              {description !== null
                                ? description
                                : "No description"}
                            </h4>
                            <a onClick={() => ShowMore()}>
                              <i>{t("content.showless")}</i>
                            </a>
                          </>
                        )}

                        <br></br>
                        <LikeShare appId="583739630280650" url={currentUrl} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <h2>Trailer</h2>
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col-lg-6">
                      <div className="embed-responsive embed-responsive-16by9">
                        <iframe
                          width="1236"
                          height="695"
                          src={movie.trailer}
                          title=" Official Trailer"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Comment appId="583739630280650" url={currentUrl} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MovieDetail;
