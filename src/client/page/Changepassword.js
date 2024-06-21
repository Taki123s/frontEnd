import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API_GET_PATHS, API_PATCH_PATHS } from "../../service/Constant";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("jwt_token"); 
  const user = token ? jwtDecode(token) : null;
  const [account, setAccount] = useState("");
  const { t } = useTranslation();

  if (user == null) {
    Swal.fire({
      title: "Vui lòng đăng nhập",
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
    });
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const response = await axios.get(
            API_GET_PATHS.GET_PROFILE + `${user.idUser}`
          );
          const data = response.data;
          setAccount(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match");
      return;
    }
    const password = {
      oldPassword: document.getElementById("old_password").value,
      newPassword: document.getElementById("new-password").value,
      confirmPassword: document.getElementById("password_confirmation").value,
    };

    const formData = new FormData();
    Object.keys(password).forEach((key) => formData.append(key, password[key]));

    const response = await axios
      .patch(API_PATCH_PATHS.CHANGE_PASSWORD + `${user.idUser}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        Swal.fire({
          title: "Đổi mật khẩu thành công",
          text: response.data,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate(`/`);
      })
      .catch((error) => {
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
    <div className="container">
      <div className="s1024:max-w-[980px] mx-auto mt-[30px] px-[10px] s1024:p-0 s768:flex gap-4 s1024:gap-8">
        <div className="shrink-0 w-full s768:w-[460px] s1024:w-[640px] bg-white dark:bg-slate-700 mb-5 s768:mb-0 p-4 s1024:p-8 rounded">
          <h3  style={{"text-transform": "uppercase"}} className="mb-5 border-l-4 border-red-600 pl-4">              {t("changpass.changepassword")}
          </h3>

          <div className="s768:w-[300px] text-[14px]">
            <div className="mb-3 w-full">
              <label className="w-full shrink-0" htmlFor="old_password">
              {t("changpass.old_password")}:
              </label>
              <input
                className="w-full h-8 bg-transparent rounded text-[14px] font-light"
                type="password"
                id="old_password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 w-full">
              <label className="w-full shrink-0" htmlFor="password">
              {t("changpass.new_password")}:
              </label>
              <input
                className="w-full h-8 bg-transparent rounded text-[14px] font-light"
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="7"
              />
            </div>

            <div className="mb-3 w-full">
              <label
                className="w-full shrink-0"
                htmlFor="password_confirmation"
              >
              {t("changpass.password_confirmation")}:
              </label>
              <input
                className="w-full h-8 bg-transparent rounded text-[14px] font-light"
                type="password"
                id="password_confirmation"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="7"
              />
            </div>

            <div className="w-full">
              <button
                className="navbar-form-group relative w-32 h-8 rounded bg-red-600/90 text-center text-white text-[14px] font-light"
                type="submit"
                onClick={handleChangePassword}
              >
              {t("changpass.changepassword")}:
              </button>
            </div>
          </div>
        </div>
        <div className="grow w-full bg-white dark:bg-slate-700 p-4 s1024:p-8 rounded text-[14px]">
          <ul>
            <li className="h-8 mb-3 flex items-center">
              <label className="w-20 shrink-0">              {t("changpass.username")}
              : </label>
              <label className="grow">{account.userName}</label>
            </li>
            <li className="h-8 mb-3 flex items-center"> 
              <label className="w-20 shrink-0">              {t("changpass.email")}:
         </label>
              <label className="grow">{account.email}</label>
            </li>
            <li className="h-8 mb-3 flex items-center"> 
              <label className="w-20 shrink-0"> {t("changpass.fullname")}: </label>
              <label className="grow">{account.fullName}</label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
