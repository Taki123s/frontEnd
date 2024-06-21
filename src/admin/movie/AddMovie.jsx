import React, { useEffect, useState } from "react";
import defaultAvatar from "../images/defaultImg.jpg";
import { getAdminGenre } from "../../service/CategoryServices";
import DataTable from "react-data-table-component";
import { getAllSerie } from "../../service/SerieServices";
import { addMovie } from "../../service/MovieServices";
import Swal from "sweetalert2";
import { Loading } from "../../client/component/Loading";
import { useNavigate } from "react-router-dom";

export const AddMovie = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [imageSrc, setImageSrc] = useState(defaultAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    totalChapters: "",
    vietnameseDescriptions: "",
    englishDescriptions: "",
    producer: "",
    seriesDescriptions: "",
    series: "",
    trailer: "",
    genres: [],
  });
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [series, setSeries] = useState([]);
  useEffect(() => {
    getAdminGenre()
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        Swal.fire({
          title: "Lỗi",
          text: error.response?.data.message || "Unknown error occurred",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      });
    getAllSerie()
      .then((response) => {
        setSeries(response.data);
      })
      .catch((error) => {
        Swal.fire({
          title: "Lỗi",
          text: error.response?.data.message || "Unknown error occurred",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      });
  }, []);
  const handleGenreSelect = (genreId) => {
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(genreId)) {
        return prevSelectedGenres.filter((id) => id !== genreId);
      } else {
        return [...prevSelectedGenres, genreId];
      }
    });
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
    formDt.append("genres", selectedGenres);
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
    addMovie(formDt)
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const columns = [
    {
      name: "Thêm",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedGenres.includes(row.id)}
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
      <h1>Nhập phim mới</h1>
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
                        onChange={handleChange}
                      >
                        <option value="">Chọn serie (nếu có)</option>
                        {series?.map((serie) => (
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
