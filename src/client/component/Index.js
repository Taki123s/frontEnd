import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Carousel from './Carousel';
import Topview from './Topview';
import { useTranslation } from "react-i18next";


function AnimePage() {
    const [movies, setMovies] = useState([]);
    const [ratings, setRatings] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createAt');
    const [ascending, setAscending] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        fetchMovies();
    }, [currentPage, sortBy, ascending]);

    const fetchMovies = async () => {
        try {
            const response = await axios.get(`https://backend-w87n.onrender.com/movie/index?page=${currentPage - 1}&size=${pageSize}&sortBy=${sortBy}&ascending=${ascending}`);
            const responseData = response.data;
            setMovies(responseData.movies);
            setTotalPages(Math.ceil(responseData.totalMovies / pageSize));

            // Fetch ratings for all movies
            const ratingPromises = responseData.movies.map(movie => fetchRating(movie.id));
            const ratingsArray = await Promise.all(ratingPromises);
            const ratingsObject = ratingsArray.reduce((acc, rating, index) => {
                acc[responseData.movies[index].id] = rating;
                return acc;
            }, {});
            setRatings(ratingsObject);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const fetchRating = async (movieId) => {
        try {
            const response = await axios.get(`https://backend-w87n.onrender.com/rates/average/${movieId}`);
            console.log(response)
            return response.data; // Assuming the rating is in response.data.rating
        } catch (error) {
            console.error("Error fetching rating:", error);
            return null; // Return null or a default value in case of error
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleOrderChange = (event) => {
        const selectedOption = event.target.value;
        setAscending(selectedOption === 'asc');
    };

    return (
        <div id="ah_wrapper">
            <section className="hero">
                <div className="container">
                    <div><Carousel/></div>
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
                                            <h4>{t("content.latestupdate")}</h4>
                                            <div className="sort">
                                                <select className="filter" value={sortBy} onChange={handleSortChange}>
                                                    <option value="createAt">{t("content.time")}</option>
                                                    <option value="name">Name</option>
                                                </select>
                                                {sortBy === 'createAt' ? (
                                                    <select className="filter" value={ascending ? 'asc' : 'desc'} onChange={handleOrderChange}>
                                                        <option value="desc">{t("sort.new")}</option>
                                                        <option value="asc">{t("sort.oldest")}</option>
                                                    </select>
                                                ) : (
                                                    <select className="filter" value={ascending ? 'asc' : 'desc'} onChange={handleOrderChange}>
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
                                    {movies.map(movie => (
                                        <div className="col-lg-4 col-md-6 col-sm-6" key={movie.id}>
                                            <div className="product__item">
                                                <div className="product__item__pic set-bg"
                                                     style={{backgroundImage: `url(${movie.avatarMovie})`}}>
                                                    <div className="ep">{movie.currentChapters.length} / {movie.totalChapters}</div>
                                                    <div className="view"><i className="fa fa-eye"></i> {movie.views.length}</div>
                                                    <div className="rate">

                                                        {ratings[movie.id]}   <i className="fa fa-star" style={{ color: '#f3da35' }}></i>


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
                        <Topview/>
                    </div>
                    <div className="col-md-6">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end mb-0">
                                {Array.from({length: totalPages}, (_, index) => (
                                    <li className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                                        key={index}>
                                        <a className="page-link" onClick={() => handlePageChange(index + 1)}>
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
}

export default AnimePage;