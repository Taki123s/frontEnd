import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate,Link  } from "react-router-dom";
import axios from "axios";
import { API_GET_PATHS, API_PATCH_PATHS } from "../service/Constant";
import Cookies from "js-cookie";

const EditUser = () => {
  const token = Cookies.get("jwt_token");

  const [avatar, setAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { id } = useParams();
  const [account, setAccount] = useState({});
  const [roles, setRoles] = useState([]);
  const [unableRoles, setUnableRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("personal-information");
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const handleChangeFullName = (e) => {
    setFullName(e.target.value);
  };
  const handleChangeEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsValidEmail(validateEmail(emailValue));
  };
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(regex.test(email));
    return regex.test(email);
  };

  const handleChangePhone = (e) => {
    const phoneValue = e.target.value;
    setPhone(phoneValue);
    setIsValidPhone(validatePhone(phoneValue));
  };
  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  useEffect(() => {
    fetchUserData();
    console.log(account.roleIdList);
  }, []);

  const fetchUserData = () => {
    axios
      .get(API_GET_PATHS.GET_PROFILE + `${id}`)
      .then((response) => {
        setAccount(response.data);
        setFullName(response.data.fullName);
        setImageSrc(response.data.avatarPicture);
        setEmail(response.data.email);
        setPhone(response.data.phone);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const submitEdit = async () => {
    const user = {
      name: document.getElementById("fname").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
    };

    const formData = new FormData();
    Object.keys(user).forEach((key) => formData.append(key, user[key]));

    if (avatar != null) {
      formData.append("avatarPicture", avatar);
    }

    setIsUploading(true);

    const response = await axios
      .patch(API_PATCH_PATHS.EDIT_USER + `${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsUploading(false);
        Swal.fire({
          title: "Cập nhật thành công",
          text: response.data,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/admin/UserList`);
      })
      .catch((error) => {
        setIsUploading(false);
        Swal.fire({
          title: "Lỗi",
          text: error.response.data,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      });
  };
  return (
    <div className="wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="iq-card">
              <div className="iq-card-header d-flex justify-content-between">
                <div className="iq-header-title">
                  <h4 className="card-title">Chỉnh sửa người dùng</h4>
                </div>
              </div>
              <div className="iq-card-body p-0">
                <div className="iq-edit-list">
                  <ul className="iq-edit-profile d-flex nav nav-pills">
                    <li className="col-md-3 p-0">
                      <a
                        className={`nav-link ${
                          activeTab === "personal-information" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("personal-information")}
                        href="#personal-information"
                      >
                        Thông tin người dùng
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="iq-edit-list-data">
              <div className="tab-content">
                <div
                  className={`tab-pane fade ${
                    activeTab === "personal-information" ? "active show" : ""
                  }`}
                  id="personal-information"
                  role="tabpanel"
                >
                  <div className="iq-card">
                    <div className="iq-card-header d-flex justify-content-between">
                      <div className="iq-header-title">
                        <h4 className="card-title">Thông tin cá nhân</h4>
                      </div>
                    </div>
                    <div className="iq-card-body">
                      <div>
                        <div className="form-group row align-items-center">
                          <div className="col-md-12 add-img-user">
                            <div className="profile-img-edit">
                              <img
                                className="profile-pic imgUserCustom"
                                src={imageSrc}
                                alt="profile-pic"
                              />
                              <div className="p-image">
                                <i className="ri-pencil-line upload-button"></i>
                                <input
                                  className="img-upload"
                                  type="file"
                                  accept="image/*"
                                  name="imageUser"
                                  onChange={handleImageChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="form-group col-sm-6">
                            <label htmlFor="fname">Tên người dùng :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="fname"
                              onChange={handleChangeFullName}
                              value={fullName}
                              name="fullName"
                              required="required"
                            />
                          </div>
                          <div className="form-group col-sm-6">
                            <label htmlFor="email">Email :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="email"
                              onChange={handleChangeEmail}
                              value={Email}
                              name="email"
                              required="required"
                            />
                            {!isValidEmail && (
                              <div className="text-danger">
                                Email không đúng định dạng.
                              </div>
                            )}
                          </div>
                          <div className="form-group col-sm-6">
                            <label>Loại tài khoản :</label>
                            <>
                              {account.userType === 1 && (
                                <p>Tài khoản thường</p>
                              )}
                              {account.userType === 2 && (
                                <p>Tài khoản Google</p>
                              )}
                              {account.userType === 3 && (
                                <p>Tài khoản Facebook</p>
                              )}
                            </>
                          </div>
                          <div className="form-group col-sm-6">
                            <label htmlFor="phone">Số điện thoại :</label>
                            <input
                              className="form-control"
                              id="phone"
                              onChange={handleChangePhone}
                              value={Phone}
                              name="phoneNumber"
                              required="required"
                            />
                            {!isValidPhone && (
                              <div className="text-danger">
                                Số điện thoại không đúng định dạng.
                              </div>
                            )}
                          </div>
                        </div>
                        <div id="error" style={{ color: "red" }}></div>
                        <button
                          type="submit"
                          className="btn btn-primary mr-2"
                          onClick={submitEdit}
                          disabled={!isValidEmail | !isValidPhone}
                        >
                          Xác nhận
                        </button>
                        <button type="reset" className="btn iq-bg-danger">
                          <Link
                            to="/admin/UserList"
                            className=""
                          >
                            Hủy
                          </Link>{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
