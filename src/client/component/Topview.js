import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';



const Topview = () => {

  const { t, i18n } = useTranslation();
  const [movies, setMovies] = useState([]);
  const [activeFilter, setActiveFilter] = useState('day'); // Track active filter

  useEffect(() => {
    loadTopViewMovies('day'); // Load top movies for the day initially
  }, []);

  const loadTopViewMovies = async (type) => {
    try {
      const response = await axios.get(`https://backend-w87n.onrender.com/movie/top-view?type=${type}`);
      setMovies(response.data.topMovies);
      setActiveFilter(type); // Set active filter
      console.log(response);
    } catch (error) {
      console.error('Error fetching top view movies:', error);
    }
  };

  return (
      <div className="col-lg-4 col-md-6 col-sm-8">
        <div className="product__sidebar">
          <div className="product__sidebar__view">
            <div className="section-title">
              <h5>Top view</h5>
            </div>
            <div className="red-box">
              <ul className="filter__controls">
                <li className={activeFilter === 'day' ? 'active' : ''} onClick={() => loadTopViewMovies('day')}>
                  {t('Day')}
                </li>
                <li className={activeFilter === 'month' ? 'active' : ''} onClick={() => loadTopViewMovies('month')}>
                  {t('Month')}
                </li>
                <li className={activeFilter === 'year' ? 'active' : ''} onClick={() => loadTopViewMovies('year')}>
                  {t('Year')}
                </li>
              </ul>
            </div>
            <br />
            <div className="filter__gallery">
              {movies.map((movie) => (
                  <div
                      key={movie.id}
                      className="product__sidebar__view__item set-bg mix day"
                      style={{
                        backgroundImage: `url(${movie.avatarMovie})`,
                        backgroundPosition: 'top',
                        backgroundSize: 'cover',
                      }}
                  >
                    <div className="ep">
                      {movie.currentChapters.length}/{movie.totalChapters}
                    </div>
                    <div className="view" style={{ bottom: '10px', right: '10px', top: 'unset' }}>
                      <i className="fa fa-eye"></i> {movie.views.length}
                    </div>
                    <div className="rate">
                      {movie.rates.length}
                      <i className="fa fa-star" style={{ color: '#f3da35' }}></i>
                    </div>

                    <h5>
                      <a href={`/movieDetail?idMovie=${movie.id}`}>{movie.name}</a>
                    </h5>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Topview;
