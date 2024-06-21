import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { editMovie, getMovieById } from "../../service/MovieServices";
import Swal from "sweetalert2";
import { Loading } from "../../client/component/Loading";
import DataTable from "react-data-table-component";
import { getGenreList } from "../../service/CategoryServices";
import { getAllSerie } from "../../service/SerieServices";
import { useNavigate } from "react-router-dom";

export const EditMovie = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [imageSrc, setImageSrc] = useState(movie.avatarMovie);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [formData, setFormData] = useState({});
  const [genres, setGenres] = useState([]);
  const [series, setSeries] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };
  useEffect(() => {
    getMovieById(movieId)
      .then((response) => {
        const movieData = response.data;
        setMovie(movieData);
        setImageSrc(movieData.avatarMovie);
        setFormData({
          name: movieData.name,
          totalChapters: movieData.totalChapters,
          vietnameseDescriptions: movieData.vietnameseDescriptions,
          englishDescriptions: movieData.englishDescriptions,
          producer: movieData.producer,
          seriesDescriptions: movieData.seriesDescriptions
            ? movieData.seriesDescriptions
            : "",
          series: movieData.serie?movieData.serie.id:"",
          trailer: movieData.trailer,
          genres: movieData.genres
            ? movieData.genres.map((genre) => genre.id)
            : [],
        });
        getGenreList()
          .then((response) => {
            setGenres(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        getAllSerie()
          .then((response) => {
            setSeries(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [movieId]);
  const submidAdd = () => {
    const formDt = new FormData();
    const {
      name,
      totalChapters,
      vietnameseDescriptions,
      englishDescriptions,
      producer,
      seriesDescriptions,
      series,
      trailer,
      genres,
    } = formData;
    if (
      !name ||
      !totalChapters ||
      !vietnameseDescriptions ||
      !englishDescriptions ||
      !producer ||
      !trailer
    ) {
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng nhập đủ thông tin",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    formDt.append("name", name);
    formDt.append("totalChapters", totalChapters);
    formDt.append("vietnameseDescriptions", vietnameseDescriptions);
    formDt.append("englishDescriptions", englishDescriptions);
    formDt.append("producer", producer);
    formDt.append("series", series);
    formDt.append("trailer", trailer);
    formDt.append("seriesDescriptions", seriesDescriptions);
    formDt.append("genres", genres);
    if (avatar == null) {
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng chọn ảnh đại diện cho phim",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    formDt.append("file", avatar);
    setIsUploading(true);
    editMovie(movieId, formDt)
      .then((response) => {
        setIsUploading(false);
        Swal.fire({
          title: "Thành công",
          text: response.data,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin/listMovie");
        });
      })
      .catch((error) => {
        setIsUploading(false);
        Swal.fire({
          title: "Lỗi",
          text: error.response?.data.message || "Unknown error occurred",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      });
  };
  const handleGenreSelect = (genreId) => {
    setFormData((prevState) => {
      const updatedGenres = prevState.genres.includes(genreId)
        ? prevState.genres.filter((id) => id !== genreId)
        : [...prevState.genres, genreId];
      return {
        ...prevState,
        genres: updatedGenres,
      };
    });
  };
  const columns = [
    {
      name: "Thêm",
      cell: (row) => (
        <input
          type="checkbox"
          checked={formData.genres.includes(row.id)}
          onChange={() => handleGenreSelect(row.id)}
        />
      ),
    },
    {
      name: "Thể loại",
      selector: (row) => row.description,
    },
  ];
  return (
    <div>
      <Loading open={isUploading} />
      <h1>Chỉnh sửa phim</h1>
      <form className="needs-validation">
        <div className="row">
          <div className="col-lg-3">
            <div className="iq-card">
              <div className="iq-card-header d-flex justify-content-between">
                <div className="iq-header-title">
                  <h4 className="card-title">Chọn ảnh đại diện</h4>
                </div>
              </div>
              <div className="iq-card-body">
                <div className="form-group">
                  <div className="add-img-user profile-img-edit">
                    <div className="p-image" style={{ textAlign: "center" }}>
                      <div id="image-render-area">
                        <img
                          id="avatarMovie"
                          src={imageSrc}
                          alt="Uploaded Avatar"
                          style={{
                            width: "300px",
                            height: "300px",
                            borderRadius: "20px",
                            filter:
                              "drop-shadow(10px 10px 4px rgb(231 33 143 / 66%))",
                          }}
                        />
                      </div>
                      <label
                        className="upload-button btn btn-outline-success"
                        style={{ marginTop: "10px" }}
                      >
                        Tải lên
                        <input
                          className="file-upload"
                          type="file"
                          accept="image/*"
                          name="avatar"
                          id="uploadImage"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="iq-card">
              <div className="iq-card-header d-flex justify-content-between">
                <div className="iq-header-title">
                  <h4 className="card-title">Thông tin phim mới</h4>
                </div>
              </div>
              <div className="iq-card-body">
                <div className="new-user-info">
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="name">Tên phim: </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="totalChapters">Tổng số tập:</label>
                      <input
                        type="number"
                        className="form-control"
                        id="totalChapters"
                        name="totalChapters"
                        placeholder="Total Chapters"
                        value={formData.totalChapters}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="vietnameseDescriptions">
                        Mô tả tiếng Việt:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vietnameseDescriptions"
                        name="vietnameseDescriptions"
                        placeholder="Vietnamese Descriptions"
                        value={formData.vietnameseDescriptions}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="englishDescriptions">
                        Mô tả tiếng Anh:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="englishDescriptions"
                        name="englishDescriptions"
                        placeholder="English Descriptions"
                        value={formData.englishDescriptions}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="producer">Nhà sản xuất:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="producer"
                        name="producer"
                        placeholder="Producer"
                        value={formData.producer}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="trailer">Trailer:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="trailer"
                        name="trailer"
                        placeholder="Trailer"
                        value={formData.trailer}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <hr />
                  <h5 className="mb-3">Mở rộng</h5>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <div id="GenresRender">
                        <label>Chọn thể loại</label>
                        <DataTable
                          columns={columns}
                          data={Array.isArray(genres) ? genres : []}
                        />
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="series">Chọn Serie:</label>
                      <select
                        className="form-control"
                        id="series"
                        name="series"
                        value={formData.series}
                        onChange={handleChange}
                      >
                        <option value="">Chọn serie (nếu có)</option>
                        {series.map((serie) => (
                          <option key={serie.id} value={serie.id}>
                            {serie.descriptions}
                          </option>
                        ))}
                      </select>
                      {formData.series && (
                        <div
                          className="form-group col-md-12"
                          style={{ marginTop: "15px" }}
                        >
                          <label htmlFor="producer">Mô tả trong serie:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="seriesDescriptions"
                            name="seriesDescriptions"
                            placeholder="seriesDescriptions"
                            value={formData.seriesDescriptions}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    id="addMovieBt"
                    onClick={submidAdd}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
