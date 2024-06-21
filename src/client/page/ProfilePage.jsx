import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_GET_PATHS, API_PATCH_PATHS } from "../../service/Constant";
import Swal from "sweetalert2";
import { refreshToken } from "../../service/AuthServices";

function ProfilePage() {
  const [isUploading, setIsUploading] = useState(false);

  const [account, setAccount] = useState("");
  var token = Cookies.get("jwt_token");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [service, setService] = useState([]);
  const [imageSrc, setImageSrc] = useState("");
  const [avatar, setAvatar] = useState(null);
  const user = typeof token === "undefined" ? null : jwtDecode(token);

  useEffect(() => {
    fetchData();
    FetchService();
  }, []); // Empty dependency array ensures useEffect runs only once after the initial render
  const fetchData = async () => {
    try {
      if (user) {
        const response = await axios.get(
          API_GET_PATHS.GET_PROFILE + `${user.idUser}`
        );
        const data = response.data;
        console.log(response.data);
        setAccount(data);
        console.log(data.avatarPicture);
        setImageSrc(data.avatarPicture);
        setUsername(data.userName);
        setFullName(data.fullName);
        setPhone(data.phone);
        setEmail(data.email);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const FetchService = async () => {
    try {
      if (user) {
        const response = await axios.get(
          API_GET_PATHS.GET_ALL_SERVICE_PACK + `?userID=${user.idUser}`
        );
        const data = response.data;
        setService(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);

    if (!validateEmail(email)) {
      setEmailError("Invalid email address format");
    } else {
      setEmailError("");
    }
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setPhone(phone);

    if (!validatePhone(phone)) {
      setPhoneError("Invalid phone number format");
    } else {
      setPhoneError("");
    }
  };
  const handleFullNameChange = (e) => {
    const fullName = e.target.value;
    setFullName(fullName);
  };
  const handleUserNameChange = (e) => {
    const userName = e.target.value;
    setUsername(userName);
  };
  const isSaveDisabled = emailError || phoneError;

  const ChangeInformation = async () => {
    console.log(user);
    console.log(account);

    try {
      const newUserData = {
        id: account.id,
        userName: username,
        password: "",
        email: email,
        fullName: fullName,
        phone: phone,
      };

      const formData = new FormData();
      Object.keys(newUserData).forEach((key) =>
        formData.append(key, newUserData[key])
      );

      //   // Append avatar only if it's not null
      if (avatar !== null) {
        formData.append("avatarPicture", avatar);
      } else {
        Swal.fire({
          title: "Thông báo",
          text: "Vui lòng chọn ảnh đại diện",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
        return; // Return early if avatar is not selected
      }

      setIsUploading(true);

      const response = await axios
        .patch(API_PATCH_PATHS.UPDATE_PROFILE, formData)
        .then((response) => {
          setIsUploading(false);
          Swal.fire({
            title: "Thành công",
            text: "Chỉnh sửa thành công!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          refreshToken(token);

        });
    } catch (error) {
      setIsUploading(false);
      Swal.fire({
        title: "Lỗi",
        text: error.response.data,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const convertToDateOnly = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  return (
    <section style={{ backgroundColor: "#eee" }}>
      <div className="container py-5">
        <div className="row">
          <div className="col">
            <nav
              aria-label="breadcrumb"
              className="bg-light rounded-3 p-3 mb-4"
            >
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a className="text-dark" href="src/client/page#">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a className="text-dark" href="src/client/page#">
                    User
                  </a>
                </li>
                <li
                  className="breadcrumb-item active text-primary"
                  aria-current="page"
                >
                  User Profile
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Full Name</p>
                  </div>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control text-dark border-0"
                      defaultValue={account.fullName}
                      onChange={handleFullNameChange}
                    />
                  </div>
                </div>

                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">User Name</p>
                  </div>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control text-dark border-0"
                      defaultValue={account.userName}
                      onChange={handleUserNameChange}
                    />
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                  </div>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control text-dark border-0"
                      defaultValue={account.email}
                      onChange={handleEmailChange}
                    />
                    {emailError && (
                      <div style={{ color: "red" }}>{emailError}</div>
                    )}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Phone</p>
                  </div>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control text-dark border-0"
                      defaultValue={account.phone}
                      onChange={handlePhoneChange}
                    />
                    {phoneError && (
                      <div style={{ color: "red" }}>{phoneError}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <button
                  className="btn btn-primary"
                  onClick={() => ChangeInformation()}
                  disabled={isSaveDisabled}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <img
              src={imageSrc}
              alt="avatar"
              className="rounded-circle"
              style={{ width: "200px", height: "200px" }}
            />
            <label className="upload-button btn iq-bg-primary col-md-4 ">
              Change
              <input
                className="img-upload"
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                name="avatar"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
        <div className="row">
          {service != null ? (
            <>
              {service.map((s) => (
                <>
                  <div className="col-md-8">
                    <div className="display-5  text-primary mb-1">
                      Gói Đã Mua
                    </div>

                    <div className="card mb-4">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Tên gói</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="mb-0">
                              {s.servicePackId.service_type}
                            </p>
                          </div>
                        </div>

                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Ngày mua</p>
                          </div>
                          <div className="col-sm-9">
                            <p>{convertToDateOnly(s.servicePackId.createAt)}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Ngày hết hạn</p>
                          </div>
                          <div className="col-sm-9">
                            <p>{convertToDateOnly(s.expiredTime)}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Trạng thái</p>
                          </div>
                          <div className="col-sm-9">
                            {s.status ? (
                              <a className="text-success">Hoạt động</a>
                            ) : (
                              <a className="text-danger">Hết hạn</a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  );
}
export default ProfilePage;
