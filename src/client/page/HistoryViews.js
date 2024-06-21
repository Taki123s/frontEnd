import React, {useState, useEffect} from "react";
import {movieViewed} from "../../service/MovieServices";
import {AiOutlineMore} from "react-icons/ai";
import MovieFollowItem from "./MovieFollowItem";
import "../../css/follow.css";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";
import {MdDelete} from "react-icons/md";
import Carousel from "../component/Carousel";
import Topview from "../component/Topview";
import {useTranslation} from "react-i18next";
import axios from "axios";

function Viewed() {
    const [listMovie, setListMovie] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // State to handle loading
    const [movies, setMovies] = useState([]);
    const [ratings, setRatings] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createAt');
    const [ascending, setAscending] = useState(false);
    const { t } = useTranslation();
    const token = Cookies.get("jwt_token");
    const user = token ? jwtDecode(token) : null;

    const movieViewedGet = async () => {
        try {
            const response = await movieViewed(user.idUser, token);
            console.log(response)
            setListMovie(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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

    useEffect(() => {
        if (user) {
            movieViewedGet();
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }


    if (listMovie.length === 0) {
        return <div>You have not watched any movies yet.</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div id="ah_wrapper">
            <section className="product spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="trending__product">>
                                <div className="row">
                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                        <div className="section-title">
                                            <h4>Phim Đã Xem trong tháng</h4>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                </div>
                                <div className="row">
                                    {listMovie.map(movie => (
                                        <div className="col-lg-3 col-md-6 col-sm-6" key={movie.id}>
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

                    </div>

                </div>
            </section>
        </div>
    );
}

export default Viewed;
