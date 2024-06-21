import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductItem(props) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('https://backend-w87n.onrender.com/movie/index')
        .then(response => response.json()) // Parse response data to JSON
        .then(data => {
          console.log('Data:', data);
          setMovies(data.movies); // Set movies state
        })
        .catch(error => console.error('Error:', error));
  }, []); // Empty dependency array means this effect runs once after the component mounts

  return (
      <div className="row">
        {movies.map(movie => (
            <div className="col-lg-4 col-md-6 col-sm-6" key={movie.id}>
              <div className="product__item">
                <div className="product__item__pic set-bg" style={{ backgroundImage: `url(${movie.avatarMovie})` }}>
                  <div className="ep">{movie.currentChapters.length} / {movie.totalChapters}</div>
                  <div className="view"><i className="fa fa-eye"></i> {movie.views}</div>
                </div>
                <div className="product__item__text">
                  <h5><Link to="/" >{movie.name}</Link></h5>
                </div>
              </div>
            </div>
        ))}
      </div>
  );
}

export default ProductItem;
