import React, {useEffect, useState} from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import {Link} from "react-router-dom";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  }
};


const Slider = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadTopViewMovies = async () => {
      try {
        const response = await axios.get("https://backend-w87n.onrender.com/movie/top-view?type=year"); // Replace 'all' with the appropriate type if needed
        setMovies(response.data.topMovies);
      } catch (error) {
        console.error('Error fetching top view movies:', error);
      }
    };

    loadTopViewMovies();
  }, []);
  return (
    <div className="parent">
           <style>
        {`
        .slider {
          margin: 0 10px; 
          overflow: hidden;
          padding: 1rem 0; 
        }

        .slider img {
          width: 100%;
          border-radius: 10px;
          height: auto; 
        }

        .react-multi-carousel-list {
          padding: 0rem 0 1rem 0; 
        }

        .custom-dot-list-style button {
          border: none;
          background: rgb(255, 68, 68);
        }

        .react-multi-carousel-dot.react-multi-carousel-dot--active button {
          background: rgb(255, 68, 68) !important;
        }
        `}
      </style>
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        partialVisible={false}
        dotListClass="custom-dot-list-style"
      >
        {movies.map((movie, index) => {
          return (
            <div className="slider" key={index}>
              <div className="product__item">
              <div className="product__item__pic set-bg"
                   style={{backgroundImage: `url(${movie.avatarMovie})`}}>
                <div
                    className="ep">{movie.currentChapters.length} / {movie.totalChapters}</div>
                <div className="view"><i className="fa fa-eye"></i> {movie.views.length}
                </div>
              </div>
                <div className="product__item__text">
                  <h5><Link to={`/movie/${movie.id}`}>{movie.name}</Link></h5>
                </div>
            </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Slider;
