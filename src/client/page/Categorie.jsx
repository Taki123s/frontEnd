import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "../component/Carousel";
import Topview from "../component/Topview";
import { useParams } from "react-router-dom";
import { getMoviesByGenre } from "../../service/CategoryServices";
import axios from "axios";

export const CategoriesPage = () => {
  const [movies, setMovies] = useState([]);
  const { idGenre, nameGenre } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createAt");
  const [ascending, setAscending] = useState(false);
  const [ratings, setRatings] = useState({});
  useEffect(() => {
    getMoviesByGenre(idGenre, currentPage - 1, sortBy, ascending).then(
      (response) => {
        setMovies(response.data.movies);
        setTotalPages(Math.ceil(response.data.totalMovies / pageSize));
        const ratingPromises = response.data.movies.map((movie) =>
          fetchRating(movie.id)
        );
        Promise.all(ratingPromises)
          .then((ratingsArray) => {
            const ratingsObject = ratingsArray.reduce((acc, rating, index) => {
              acc[response.data.movies[index].id] = rating;
              return acc;
            }, {});
            setRatings(ratingsObject);
          })
          .catch((error) => {
            console.error("Error fetching ratings:", error);
          });
      }
    );
  }, [idGenre, currentPage, sortBy, ascending]);
  const fetchRating = (movieId) => {
    return axios
      .get(`https://backend-w87n.onrender.com/rates/average/${movieId}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(`Error fetching rating for movie ${movieId}:`, error);
        return null;
      });
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderChange = (event) => {
    const selectedOption = event.target.value;

    if (selectedOption === "asc") {
      setAscending(true);
    } else {
      setAscending(false);
    }
  };
  return (
    <div id="ah_wrapper">
      <section className="hero">
        <div className="container">
          <div>
            <Carousel />
          </div>
        </div>
      </section>
      <section className="product spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="trending__product">
                <div className="row">
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <div className="section-title">
                      <h4>Thể loại: {nameGenre}</h4>

                      <div className="sort">
                        <select
                          className="filter"
                          value={sortBy}
                          onChange={handleSortChange}
                        >
                          <option value="createAt">Time</option>
                          <option value="name">Name</option>
                        </select>
                        {sortBy === "createAt" ? (
                          <select
                            className="filter"
                            value={ascending ? "asc" : "desc"}
                            onChange={handleOrderChange}
                          >
                            <option value="desc">Newest</option>
                            <option value="asc">Oldest</option>
                          </select>
                        ) : (
                          <select
                            className="filter"
                            value={ascending ? "asc" : "desc"}
                            onChange={handleOrderChange}
                          >
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-4"></div>
                </div>
                <div className="row">
                  {movies.map((movie) => (
                    <div className="col-lg-4 col-md-6 col-sm-6" key={movie.id}>
                      <div className="product__item">
                        <div
                          className="product__item__pic set-bg"
                          style={{
                            backgroundImage: `url(${movie.avatarMovie})`,
                          }}
                        >
                          <div className="ep">
                            {movie.currentChapters?.length} /{" "}
                            {movie.totalChapters}
                          </div>
                          <div className="view">
                            <i className="fa fa-eye"></i> {movie.views?.length}
                          </div>
                          <div className="rate">
                            {ratings[movie.id]}
                            <i
                              className="fa fa-star"
                              style={{ color: "#f3da35" }}
                            ></i>
                          </div>
                        </div>
                        <div className="product__item__text">
                          <h5>
                            <Link to={`/movie/${movie.id}`}>{movie.name}</Link>
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* <Topview /> */}
          </div>
          <div className="col-md-6">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-end mb-0">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    className={`page-item ${
                      index + 1 === currentPage ? "active" : ""
                    }`}
                    key={index}
                  >
                    <a
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
};
