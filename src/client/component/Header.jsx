import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import {
  login,
  logout,
  checkUsername,
  sendMail,
  register,
} from "../../service/AuthServices";
import { jwtDecode } from "jwt-decode";
import iconAdmin from "../../img/icon-admin.png";
import Cookies from "js-cookie";
import logo from "../../img/logo.png";
import { getGenreList } from "../../service/CategoryServices";
import { useTranslation, Trans } from "react-i18next";
import { Dropdown, Space, Typography } from "antd";
import { searchMovie } from "../../service/MovieServices";
import { Loading } from "./Loading";
import Swal from "sweetalert2";
import { refreshToken } from "../../service/AuthServices";
export const HeaderPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const lngs = {
    en: {
      nativeName: "English",
    },
    vi: {
      nativeName: "Vietnamese",
    },
  };

  const items = [
    {
      key: "1",
      label: "Vi",
      onClick: () => i18n.changeLanguage("vi"),
    },
    {
      key: "2",
      label: "En",
      onClick: () => i18n.changeLanguage("en"),
    },
  ];
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      searchMovie(searchTerm).then((response) => {
        setSearchResults(response.data);
      });
    };

    if (searchTerm !== "") {
      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [genreList, setGenreList] = useState([]);

  const [loggedUser, setLoggedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("login");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerUsername, setRegisterUserName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRePassword, setRegisterRePassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerFullname, setRegisterFullname] = useState("");
  const [correctPassword, setCorrectPassword] = useState(false);
  const [correctUserName, setcorrectUserName] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = Cookies.get("jwt_token");
      if (token) {
        console.log("refresh");
        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();
        if (currentTime > expirationTime - 43200000) {
          try {
            refreshToken(token);
          } catch (error) {}
        }
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogin = (event) => {
    const user = { userName: username, password: password };
    login(user)
        .then((response) => {
          const token = response.data.accessToken;
          setToken(token);
          Cookies.set("jwt_token", token);
          decodeToken();
          Swal.fire({
            title: "Thành công",
            text: "Đăng nhập thành công",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch((error) => {
          Swal.fire({
            title: "Lỗi",
            text: error.response.data?.message || "Unknown error occurred",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        });
  };
  const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const EmailVerificationDialog = ({ onClose }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [email, setEmail] = useState("");
    const [isSendCodeDisabled, setSendCodeDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Gửi mã");
    const [timer, setTimer] = useState(null);
    const [registerUser, setRegisterUser] = useState({});
    useEffect(() => {
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }, [timer]);
    let currentRegister = {
      userName: registerUsername,
      password: registerPassword,
      email: registerEmail,
      fullName: registerFullname,
      phone: registerPhone,
    };
    const sendCode = (emailInput) => {
      currentRegister.email = emailInput;
      setRegisterUser(currentRegister);
      setIsUploading(true);
      sendMail(currentRegister)
          .then((response) => {
            setIsUploading(false);
            Swal.fire({
              title: "Thành công",
              text: "Đã gửi mã xác thực",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            let timeLeft = 300;
            setButtonText(`Gửi lại mã sau ${timeLeft}s`);
            const interval = setInterval(() => {
              timeLeft -= 1;
              setButtonText(`Gửi lại mã sau ${timeLeft}s`);
              if (timeLeft <= 0) {
                clearInterval(interval);
                setButtonText("Gửi mã");
                setSendCodeDisabled(false);
              }
            }, 1000);
            setTimer(interval);
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
            setSendCodeDisabled(false);
          });
    };
    const handleSendCode = () => {
      if (email && validateEmail(email)) {
        setSendCodeDisabled(true);
        sendCode(email);
      } else {
        Swal.fire({
          title: "Lỗi",
          text: "Vui lòng nhập email đúng định dạng",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    };
    const registerVerify = () => {
      let verifyUser = {
        userName: registerUser.userName,
        email: registerUser.email,
        verifyCode: verificationCode,
      };
      if (verifyUser.verifyCode == "" || verifyUser.verifyCode == null) {
        Swal.fire({
          title: "Lỗi",
          text: "Không được để trống mã xác nhận",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      register(verifyUser)
          .then((response) => {
            Swal.fire({
              title: "Thành công",
              text: "Đăng ký thành công",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            setRegisterUserName("");
            setRegisterPassword("");
            setRegisterRePassword("");
            setRegisterEmail("");
            setRegisterPhone("");
            setRegisterFullname("");
            onClose();
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
        <div className="modal-overlay">
          <Loading open={isUploading} />
          <div className="modal-content">
            <h2>Xác thực email</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <input
                type="number"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
            />
            <button
                type="button"
                onClick={handleSendCode}
                className="swal2-confirm swal2-styled"
                disabled={isSendCodeDisabled}
            >
              {buttonText}
            </button>
            <button
                type="button"
                onClick={registerVerify}
                className="swal2-confirm swal2-styled"
            >
              Xác nhận đăng ký
            </button>
            <button
                type="button"
                onClick={onClose}
                className="swal2-cancel swal2-styled"
            >
              Đóng
            </button>
          </div>
        </div>
    );
  };
  const handleRegister = () => {
    if (
        correctUserName &&
        registerPassword.trim().length >= 8 &&
        registerPassword == registerRePassword
    ) {
      const navbarRight = document.getElementById("navbar-right");
      navbarRight.classList.toggle("-right-[300px]");
      const modalDiv = document.createElement("div");
      document.body.appendChild(modalDiv);
      const root = createRoot(modalDiv);
      root.render(<EmailVerificationDialog onClose={() => root.unmount()} />);
    } else {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng điền đầy đủ và hợp lệ các trường, mật khẩu phải có độ dài hơn 8 ký tự!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const checkCorrectRePassword = (e) => {
    let errorPassword = document.getElementById("errorPassword");
    if (registerPassword !== e.target.value) {
      errorPassword.innerText = "Mật khẩu xác thực không hợp lệ";
      setCorrectPassword(false);
    } else {
      setCorrectPassword(true);
      errorPassword.innerText = "";
    }
    setRegisterRePassword(e.target.value);
  };
  const checkCorrectPassword = (e) => {
    let errorPassword = document.getElementById("errorPassword");
    if (e.target.value !== registerRePassword) {
      errorPassword.innerText = "Mật khẩu xác thực không hợp lệ";
      setCorrectPassword(false);
    } else {
      setCorrectPassword(true);
      errorPassword.innerText = "";
    }
    setRegisterPassword(e.target.value);
  };
  const checkUsernameR = (e) => {
    let errorUserName = document.getElementById("errorUserName");
    checkUsername(e.target.value)
        .then(() => {
          setRegisterUserName(e.target.value);
          errorUserName.innerText = "";
          setcorrectUserName(true);
        })
        .catch((error) => {
          setcorrectUserName(false);
          errorUserName.innerText =
              error.response?.data || "Unknown error occurred";
        });
  };
  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };
  useEffect(() => {
    getGenreList()
        .then((response) => {
          setGenreList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const navbarAvatar = document.getElementById("navbar-avatar");
    const navbarRight = document.getElementById("navbar-right");
    const close = document.getElementById("navbar-close");
    const toggleNavbar = () => {
      navbarRight.classList.toggle("-right-[300px]");
    };

    if (navbarAvatar) {
      navbarAvatar.addEventListener("click", toggleNavbar);
    }

    if (close) {
      close.addEventListener("click", toggleNavbar);
    }
    return () => {
      if (navbarAvatar) {
        navbarAvatar.removeEventListener("click", toggleNavbar);
      }
      if (close) {
        close.removeEventListener("click", toggleNavbar);
      }
    };
  }, [loggedUser]);

  const handleLogout = (event) => {
    const logoutToken = { token: token };
    logout(logoutToken)
        .then((response) => {
          console.log("response :" + response);
          Cookies.remove("jwt_token");
          setLoggedUser(null);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  const decodeToken = () => {
    const token = Cookies.get("jwt_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRoles = decodedToken.scope.split(" ");
      const roles = ["ROLE_ADMIN", "view_dashboard"];
      console.log(userRoles)
      if (userRoles && roles && roles.some((role) => userRoles.includes(role))) {
        setIsAdmin(true);
      }
      setToken(token);
      setLoggedUser(decodedToken);
    }
  };
  useEffect(() => {
    getGenreList()
        .then((response) => {
          setGenreList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    decodeToken();
  }, []);
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  useEffect(() => {
    const navbarLeft = document.getElementById("navbar-left");
    const navbarRes = document.getElementById("navbar-Res");
    const showNavbar = () => {
      navbarLeft.classList.toggle("-left-[300px]");
    };
    if (navbarRes) {
      navbarRes.addEventListener("click", showNavbar);
    }
    return () => {
      if (navbarRes) {
        navbarRes.removeEventListener("click", showNavbar);
      }
    };
  }, []);

  return (
      <header className="h-[60px]">
        <nav className="fixed top-0 left-0 right-0 bg-white shadow dark:shadow-slate-700 bg-white dark:bg-slate-800 dark:shadow-slate-700  z-1000">
          <div className="container px-[10px] s1024:px-0 mx-auto h-[60px] flex s375:gap-3 items-center">
            <div className="navbar-brand h-[50px] w-[200px] s768:w-[180px] flex justify-between shrink-0 s1280:mr-2 s1366:mr-3 z-50">
              <a className="">
                <Link to={"/index"}>
                  <img className="h-full" src={logo} alt="" />{" "}
                </Link>
              </a>
              <div
                  className="navbar-toggle h-[50px] p-[10px] flex items-center s768:hidden"
                  id="navbar-Res"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </div>
            </div>
            <div
                className="navbar-left overflow-scroll h-full s768:left-0 s768:h-[50px] shadow s768:relative w-[300px] s768:w-auto s768:h-auto s768:flex top-0 -left-[300px] bottom-0 bg-white s768:bg-transparent dark:s768:bg-transparent dark:bg-slate-800/90 dark:shadow-slate-700 s768:shadow-none s768:grow s768:overflow-visible pl-[10px] pr-0 pt-[60px] s768:p-0 z-40 transition-all duration-300 absolute"
                id="navbar-left"
            >
              <div className="navbar-close absolute top-4 right-4 hidden">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div
                  className="s768:mt-0 s768:pr-0 flex flex-col s768:flex-row s768:grow  gap-4 s768:gap-2 s1280:gap-3"
                  style={{ background: "white" }}
              >
                <div className="navbar-item  s768:h-[30px] dark:s768:border-gray-700 s768:border s768:rounded-full s768:hover:text-red-600 dark:s768:hover:text-teal-500 s768:order-1">
                  <a className="h-full flex gap-4 uppercase s768:normal-case items-center text-[14px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="shrink-0 w-5 h-5 s768:hidden"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                      />
                    </svg>
                    <Link to={"/index"}>
                      {" "}
                      <span className="s768:px-3 s1024:px-2 s1280:px-3 s1366:px-4 s768:text-[14px]">
                      {t("menu.home")}
                    </span>
                    </Link>
                  </a>
                </div>
                <div className="navbar-item s768:h-[30px] dark:s768:border-gray-700 s768:border s768:rounded-full s768:order-2">
                  <a
                      className="h-full flex gap-4 uppercase s768:normal-case items-center text-[14px]"
                      href="#"
                      onMouseEnter={handleMouseEnter}
                      onClick={handleMouseEnter}
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="shrink-0 w-5 h-5 s768:hidden"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                      />
                    </svg>
                    <span className="s768:px-3 s1024:px-2 s1280:px-3 s1366:px-4 s768:text-[14px]">
                    <Trans i18nKey={"menu.categories"}>
                      {t("menu.categories")}
                    </Trans>
                  </span>
                  </a>
                  {dropdownOpen && (
                      <div
                          className="fixed bg-white shadow shadow-md mt-1 rounded-md py-1 z-10"
                          onMouseLeave={handleMouseLeave}
                      >
                        <ul className="categories-dropdown">
                          {Array.isArray(genreList) &&
                              genreList?.map((genre) => {
                                return (
                                    <Link
                                        key={genre.id}
                                        to={`/categories/${genre.id}/${genre.description}`}
                                    >
                                      <li className="px-4 py-2 cursor-pointer categories-dropdown-item">
                                        {genre.description}
                                      </li>
                                    </Link>
                                );
                              })}
                        </ul>
                      </div>
                  )}
                </div>

                <div className="navbar-item s768:h-[30px] dark:s768:border-gray-700 s768:border s768:rounded-full s768:hover:text-red-600 dark:s768:hover:text-teal-500 s768:order-5">
                  <a className="h-full flex gap-4 uppercase s768:normal-case items-center text-[14px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="shrink-0 w-5 h-5 s768:hidden"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                      />
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                      />
                    </svg>
                    <Link to={"/servicePack"}>
                      {" "}
                      <span className="s768:px-3 s1024:px-2 s1280:px-3 s1366:px-4 s768:text-[14px]">
                      {t("menu.servicepack")}
                    </span>
                    </Link>
                  </a>
                </div>

                <div className="navbar-item s768:h-[30px] dark:s768:border-gray-700 s768:border s768:rounded-full s768:hover:text-red-600 dark:s768:hover:text-teal-500 s768:order-4">
                  <a>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="shrink-0 w-5 h-5 s768:hidden"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                      />
                    </svg>
                    <Link to={"/about-us"}>
                      {" "}
                      <span className="s768:px-3 s1024:px-2 s1280:px-3 s1366:px-4 s768:text-[14px]">
                      About us
                    </span>
                    </Link>
                  </a>
                </div>
                <div className="group/search navbar-search s768:order-last s768:ml-auto s1024:w-[300px] s1280:w-[320px]">
                  <div className="">
                    <div>
                      <input
                          className="rounded-full w-full h-[30px] text-[14px] font-extralight border-red-200 focus:ring-red-300 focus:border-red-200 s768:border-gray-200 s768:focus:ring-red-300 s768:focus:border-red-200 bg-transparent dark:bg-transparent dark:border-teal-500 s768:dark:border-gray-700 dark:focus:border-teal-500 dark:focus:ring-teal-500"
                          id=""
                          type="text"
                          name="search"
                          autoComplete="off"
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 absolute top-[2px] right-[2px] text-gray-200 group-hover/search:text-red-300 dark:text-slate-700 dark:group-hover/search:text-teal-500"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </div>

                    <div
                        style={{
                          width: "320px",
                          right: 0,
                          top: "44px",
                          backgroundColor: "#fffff",
                        }}
                        className="shadow-xl absolute overflow-scroll right-0 h-[200px] flex flex-col"
                    >
                      {searchResults.map((result) => (
                          <div
                              style={{ backgroundColor: "#fffff" }}
                              className="w-full bg-white"
                              key={result.id}
                          >
                            <a
                                style={{ backgroundColor: "#fffff" }}
                                className="flex gap-3 "
                                href={`/movie/${result.id}`}
                            >
                              <img className="h-12 w-12" src={result.avatarMovie} />
                              <div> {result.name}</div>
                            </a>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loggedUser != null && (
                <div className="navbar-user relative shrink-0 h-[40px] s1024:w-[145px] s1280:w-[294px] s1366:w-[320px] ml-auto flex justify-end gap-2">
                  <div
                      className="overflow-hidden w-[40px] h-[40px] p-[10px] rounded-full bg-gray-100 dark:bg-slate-700 user-theme hidden s360:block"
                      id="user-theme"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-full h-full fill-slate-800 dark:fill-none dark:stroke-white"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      ></path>
                    </svg>
                  </div>

                  {/* // language */}

                  <div className="overflow-hidden w-[40px] h-[40px] rounded-full bg-gray-100 dark:bg-slate-700 flex justify-center items-center text-center">
                    <Dropdown
                        menu={{
                          items,
                          selectable: true,
                          defaultSelectedKeys: ["2"],
                        }}
                    >
                      <Typography.Link>
                        <Space>
                      <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 0 24 24"
                            alt="Language"
                            width="24px"
                            fill="#666666"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                        </svg>
                      </span>
                        </Space>
                      </Typography.Link>
                    </Dropdown>
                  </div>

                  <div className="user-notification relative w-[40px] h-[40px] rounded-full bg-gray-100 dark:bg-slate-700 flex justify-center items-center text-center hidden s412:flex s1024:hidden s1280:flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                      ></path>
                    </svg>
                    <span className="absolute top-0 right-0 bg-red-600 rounded-full px-1 text-white text-[10px]  hidden ">
                  0
                </span>
                  </div>
                  <div
                      className="navbar-avatar w-[40px] h-[40px] rounded-full overflow-hidden"
                      id="navbar-avatar"
                  >
                    <img className="w-full h-full" src={loggedUser?.avt} />
                  </div>
                </div>
            )}

            {loggedUser == null && (
                <div className="navbar-user relative shrink-0 h-[40px] s1024:w-[145px] s1280:w-[294px] s1366:w-[320px] ml-auto flex justify-end gap-2">
                  <div className="overflow-hidden w-[40px] h-[40px] rounded-full bg-gray-100 dark:bg-slate-700 flex justify-center items-center text-center">
                    <Dropdown
                        menu={{
                          items,
                          selectable: true,
                          defaultSelectedKeys: ["2"],
                        }}
                    >
                      <Typography.Link>
                        <Space>
                      <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 0 24 24"
                            alt="Language"
                            width="24px"
                            fill="#666666"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                        </svg>
                      </span>
                        </Space>
                      </Typography.Link>
                    </Dropdown>
                  </div>

                  <div
                      className="overflow-hidden w-[40px] h-[40px] p-[10px] rounded-full bg-gray-100 dark:bg-slate-700 user-theme hidden s360:block"
                      id="user-theme"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-full h-full fill-slate-800 dark:fill-none dark:stroke-white"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  </div>
                  <div className="overflow-hidden w-[40px] h-[40px] rounded-full bg-gray-100 dark:bg-slate-700 flex justify-center items-center text-center">
                    <a href="/page/chinh-sach-rieng-tu">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </a>
                  </div>
                  <div
                      className="navbar-avatar overflow-hidden w-[40px] h-[40px] rounded-full bg-gray-100 dark:bg-slate-700 flex justify-center items-center text-center"
                      id="navbar-avatar"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                </div>
            )}
            {loggedUser == null && (
                <div
                    className="navbar-right fixed overflow-hidden h-full shadow w-[300px] top-0 bottom-0 bg-white dark:bg-slate-800/90 dark:shadow-slate-700 z-50 transition-all duration-300 right-0 -right-[300px]"
                    id="navbar-right"
                >
                  <div
                      className="navbar-close absolute top-2 left-2 w-8 h-8 opacity-60"
                      id="navbar-close"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                  <div className="navbar-user navbar-user-header px-3 pt-[55px] bg-white ">
                    <div className="user-avatar big-avatar absolute top-3 right-3 w-20 h-20 flex items-center justify-center bg-gray-600 text-white rounded-full overflow-hidden">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-10 h-10 inline-block self-center"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        ></path>
                      </svg>
                    </div>
                    <div className="navbar-user-welcome mb-4">
                  <span className="w-[165px] line-clamp-1 text-[14px]">
                    {t("content.welcome")}!
                  </span>
                    </div>
                    <div
                        className="navbar-user-tab flex gap-4 h-6 mb-2 uppercase text-[13px] font-medium"
                        id="chooseTab"
                    >
                      <div
                          className={`navbar-user-tab-item navbar-tab-login ${
                              activeTab === "login" ? "activated border-red-500" : ""
                          } h-full cursor-pointer border-b-2`}
                          data-tab="login"
                          onClick={() => handleTabClick("login")}
                      >
                        {t("menu.login")}
                      </div>
                      <div
                          className={`navbar-user-tab-item navbar-tab-signup ${
                              activeTab === "signup" ? "activated border-red-500" : ""
                          } h-full cursor-pointer border-b-2`}
                          data-tab="signup"
                          onClick={() => handleTabClick("signup")}
                      >
                        {t("menu.signup")}
                      </div>
                    </div>
                  </div>
                  {activeTab === "login" && (
                      <form>
                        <div
                            className="navbar-user-body tab-login px-3 ps-container ps-theme-default"
                            data-ps-id="1a9be0da-8957-4b2d-c90f-935a0efd2506"
                            style={{ maxHeight: "842px" }}
                        >
                          <div className="navbar-form-group relative mb-3">
                            <label className="mb-1 block text-[14px]">
                              {t("login.username")}
                            </label>
                            <input
                                className="text-[14px] font-extralight w-full h-8 pl-6 rounded"
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={true}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4 absolute left-1 bottom-2"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              ></path>
                            </svg>
                            <span className="tip absolute top-1 right-0 text-[10px] text-red-500"></span>
                          </div>
                          <div className="navbar-form-group relative mb-3">
                            <label className="mb-1 block text-[14px]">
                              {t("login.password")}
                            </label>
                            <input
                                className="text-[14px] font-extralight w-full h-8 pl-6  rounded"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4 absolute left-1 bottom-2"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                              ></path>
                            </svg>
                            <span className="tip absolute top-1 right-0 text-[10px] text-red-500"></span>
                          </div>
                          <div className="navbar-form-group relative mb-3 flex justify-between text-[14px] font-light">
                            <a className="forgot-password">
                              <Link to={"/forgot-password"}>
                                {t("content.forgotpassword")}{" "}
                              </Link>
                            </a>
                          </div>
                          <div className="navbar-form-group relative mb-3 hidden">
                            <ul id="form-login-warning"></ul>
                          </div>
                          <div className="navbar-form-group relative mb-3 h-8 rounded bg-red-600/90 text-center text-white text-[14px] font-light submit">
                            <input
                                className="AnimeWeb w-full h-full rounded cursor-pointer"
                                id="login"
                                type="button"
                                name="submit"
                                value={t("menu.login")}
                                onClick={handleLogin}
                            />
                          </div>
                          <hr className="mb-3 border-gray-300 dark:border-slate-600" />
                          <div className="navbar-form-group relative mb-3 h-8 rounded bg-orange-600/90 text-center text-white text-[14px] font-light">
                            <a
                                className="social-login"
                                href="https://backend-w87n.onrender.com/oauth2/authorization/google"
                            >
                              <input
                                  type="button"
                                  className="google w-full h-full rounded cursor-pointer"
                                  value={t("content.logingg")}
                              />
                            </a>
                          </div>
                          <div className="navbar-form-group relative mb-3 h-8 rounded bg-blue-600/90 text-center text-white text-[14px] font-light">
                            <a
                                className="social-login"
                                href="https://backend-w87n.onrender.com/oauth2/authorization/facebook"
                            >
                              <input
                                  type="button"
                                  className="facebook w-full h-full rounded cursor-pointer"
                                  value={t("content.fb")}
                              />
                            </a>
                          </div>
                          <div
                              className="ps-scrollbar-x-rail"
                              style={{ left: "0px", bottom: "0px" }}
                          >
                            <div
                                className="ps-scrollbar-x"
                                tabIndex="0"
                                style={{ left: "0px", width: " 0px" }}
                            ></div>
                          </div>
                          <div
                              className="ps-scrollbar-y-rail"
                              style={{ top: "0px", right: "0px" }}
                          >
                            <div
                                className="ps-scrollbar-y"
                                tabIndex="0"
                                style={{ top: "0px", height: "0px" }}
                            ></div>
                          </div>
                        </div>
                      </form>
                  )}
                  {activeTab === "signup" && (
                      <form>
                        <div
                            className="navbar-user-body tab-signup px-3 ps-container ps-theme-default"
                            data-ps-id="02318dc8-08c6-d9ba-7736-072f7f3ee729"
                            style={{ maxHeight: "842px" }}
                        >
                          <div className="navbar-form-group relative mb-3">
                            <label className="mb-1 block text-[14px]">
                              {t("login.username")}{" "}
                            </label>
                            <div id="errorUserName" style={{ color: "red" }}></div>
                            <input
                                className="text-[14px] font-extralight w-full h-8 pl-6  rounded"
                                type="text"
                                name="username"
                                onChange={checkUsernameR}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4 absolute left-1 bottom-2"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              ></path>
                            </svg>
                            <span className="tip absolute top-1 right-0 text-[10px] text-red-500"></span>
                          </div>
                          <div className="navbar-form-group relative mb-3">
                            <label className="mb-1 block text-[14px]">
                              {t("login.password")}
                            </label>

                            <input
                                className="text-[14px] font-extralight w-full h-8 pl-6  rounded"
                                type="password"
                                name="password"
                                onChange={(e) => checkCorrectPassword(e)}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4 absolute left-1 bottom-2"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                              ></path>
                            </svg>
                            <span className="tip absolute top-1 right-0 text-[10px] text-red-500"></span>
                          </div>
                          <div className="navbar-form-group relative mb-3">
                            <label className="mb-1 block text-[14px]">
                              {t("login.passwordagain")}
                            </label>
                            <div id="errorPassword" style={{ color: "red" }}></div>
                            <input
                                className="text-[14px] font-extralight w-full h-8 pl-6  rounded"
                                type="password"
                                name="password_confirm"
                                onChange={(e) => checkCorrectRePassword(e)}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4 absolute left-1 bottom-2"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                              ></path>
                            </svg>
                            <span className="tip absolute top-1 right-0 text-[10px] text-red-500"></span>
                          </div>
                          <div className="navbar-form-group relative mb-3">
                            <label className="mb-1 block text-[14px]">
                              {t("signup.fullname")}
                            </label>
                            <input
                                className="text-[14px] font-extralight w-full h-8 pl-6  rounded"
                                type="text"
                                name="full_name"
                                onChange={(e) => setRegisterFullname(e.target.value)}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4 absolute left-1 bottom-2"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                              ></path>
                            </svg>
                            <span className="tip absolute top-1 right-0 text-[10px] text-red-500"></span>
                          </div>

                          <div className="navbar-form-group relative mb-3">
                            <label className="mb-1 block text-[14px]">
                              {t("signup.phone")}
                            </label>
                            <input
                                className="text-[14px] font-extralight w-full h-8 pl-6 rounded"
                                type="number"
                                name="phone"
                                onChange={(e) => setRegisterPhone(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={faPhone}
                                className="w-4 h-4 absolute left-1 bottom-2"
                            />
                            <span className="tip absolute top-1 right-0 text-[10px] text-red-500"></span>
                          </div>
                          <div className="navbar-form-group relative hidden mb-3">
                            <ul id="form-signup-warning"></ul>
                          </div>
                          <div className="navbar-form-group relative mb-3 h-8 rounded bg-red-600/90 text-center text-white text-[14px] font-light submit">
                            <input
                                className="AnimeWeb w-full h-full rounded"
                                id="signup"
                                type="button"
                                name="submit"
                                value={t("menu.signup")}
                                onClick={handleRegister}
                            />
                          </div>
                          <div
                              className="ps-scrollbar-x-rail"
                              style={{ left: "0px", bottom: "0px" }}
                          >
                            <div
                                className="ps-scrollbar-x"
                                tabIndex="0"
                                style={{ left: "0px", width: "0px" }}
                            ></div>
                          </div>
                          <div
                              className="ps-scrollbar-y-rail"
                              style={{ top: "0px", right: "0px" }}
                          >
                            <div
                                className="ps-scrollbar-y"
                                tabIndex="0"
                                style={{ top: "0px", height: "0px" }}
                            ></div>
                          </div>
                        </div>
                      </form>
                  )}
                  <div className="loading hidden"></div>

                  <div className="loading animate-spin hidden"></div>
                </div>
            )}

            {loggedUser != null && (
                <div
                    id="navbar-right"
                    className="navbar-right fixed overflow-hidden h-full -right-[300px] shadow w-[300px] top-0 bottom-0 bg-white dark:bg-slate-800/90 dark:shadow-slate-700 z-50 transition-all duration-300 right-0"
                >
                  <div
                      className="navbar-close absolute top-2 left-2 w-8 h-8 opacity-60"
                      id="navbar-close"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                  <div className="navbar-user navbar-user-header px-3 pt-[55px] bg-white dark:bg-transparent">
                    <div className="group/avatar user-avatar big-avatar absolute top-3 right-3 w-20 h-20">
                      <img
                          className="self-avatar w-full h-full rounded-full"
                          src={loggedUser.avt}
                      />
                      <div className="user-avatar-update absolute w-8 h-8 top-6 left-6 rounded-lg bg-black/50 text-white opacity-50 flex items-center text-center hidden group-hover/avatar:block">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 inline-block"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          ></path>
                        </svg>
                      </div>
                      <input
                          className="user-avatar-file absolute w-8 h-8 top-6 left-6 z-10 opacity-0"
                          id="avatar-upload"
                          type="file"
                          name="avatar_file"
                          accept="image/png,image/jpeg"
                      />
                    </div>
                    <div className="navbar-user-welcome mb-4">
                  <span className="w-[180px] line-clamp-1 text-[14px]">
                    {t("content.welcome")}
                    {loggedUser?.fullName}!
                  </span>
                      <input id="user-id" type="hidden" value="995002" />
                      <input id="user-role" type="hidden" value="10" />
                      <input
                          id="user-date"
                          type="hidden"
                          value="2024-05-17 13:35:24"
                      />
                      <input
                          id="user-last-login"
                          type="hidden"
                          value="2024-05-17 13:35:24"
                      />
                    </div>
                    <div className="navbar-user-tab flex gap-4 h-6 mb-2 uppercase text-[13px] font-medium border-b border-gray-200 dark:border-slate-700">
                      <div
                          className="navbar-user-tab-item navbar-tab-information activated border-red-500 h-full cursor-pointer border-b-2"
                          data-tab="information"
                      >
                        {t("content.infor")}
                      </div>
                    </div>
                  </div>
                  <div
                      className="navbar-user-body tab-information px-3 ps-container ps-theme-default"
                      data-ps-id="a2c9df2c-3f6a-f0a5-5905-8233369b1549"
                      style={{ maxHeight: "842px" }}
                  >
                    <div className="navbar-user-content font-light text-[14px] s1024:text-[15px]">
                      <div className="user-item">
                        {isAdmin && (
                            <div className="block flex gap-4 items-center h-8">
                              <a
                                  className="block flex gap-4 items-center h-8"
                                  href="/admin/Dashboard"
                              >
                                {" "}
                                <img src={iconAdmin} className="w-4 h-4 shrink-0" />
                                Go to dashboard
                              </a>
                            </div>
                        )}
                        <Link
                            className="block flex gap-4 items-center h-8"
                            to="/profile"
                        >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4 shrink-0"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            ></path>
                          </svg>
                          <span> {t("login.editinformation")} </span>
                        </Link>
                      </div>
                      <div className="user-item">
                        <a
                            className="block flex gap-4 items-center h-8"
                            href="/changePassword"
                        >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4 shrink-0"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            ></path>
                          </svg>
                          <span> {t("content.chagepass")}</span>
                        </a>
                      </div>
                      <hr className="my-2 border-gray-200 dark:border-slate-700" />
                      <div className="user-item">
                        <a
                            className="block flex gap-4 items-center h-8"

                        >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4 shrink-0"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <Link to={"/viewed-movies"}> <span> {t("login.history")}</span></Link>

                        </a>
                      </div>
                      <div className="user-item">
                        <a
                            className="block flex gap-4 items-center h-8"
                            href="/follow_page"
                        >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4 shrink-0"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                            ></path>
                          </svg>
                          <span> {t("header.follow")}</span>
                        </a>
                      </div>
                      <hr className="my-2 border-gray-200 dark:border-slate-700" />


                      <div className="user-item">
                        <a className="block flex gap-4 items-center h-8">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4 shrink-0"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                            ></path>
                          </svg>
                          <Link to={"/history-packed"}>
                            {" "}
                            <span> {t("content.transactionhistory")}</span>
                          </Link>
                        </a>
                      </div>

                      <hr className="my-2 border-gray-200 dark:border-slate-700" />
                      <div
                          className="logout user-item flex gap-4 items-center h-[30px] cursor-pointer"
                          id="logout"
                          onClick={handleLogout}
                      >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4 shrink-0"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
                          ></path>
                        </svg>
                        <span> {t("content.logout")}</span>
                      </div>
                    </div>
                    <div
                        className="ps-scrollbar-x-rail"
                        style={{ left: "0px", bottom: "0px" }}
                    >
                      <div
                          className="ps-scrollbar-x"
                          tabIndex="0"
                          style={{ left: "0px", width: "0px" }}
                      ></div>
                    </div>
                    <div
                        className="ps-scrollbar-y-rail"
                        style={{ top: "0px", right: "0px" }}
                    >
                      <div
                          className="ps-scrollbar-y"
                          tabIndex="0"
                          style={{ top: "0px", height: "0px" }}
                      ></div>
                    </div>
                  </div>

                  <div
                      className="navbar-user-body tab-notification px-3 ps-container ps-theme-default hidden"
                      data-ps-id="32ac0d5a-852c-c8cf-3d67-95e2563c59f9"
                      style={{ maxHeight: "842px" }}
                  >
                    <div className="notification-list pt-3"></div>
                    <div className="notification-none font-extralight text-center leading-10 text-[14px] s1024:text-[15px]">
                      <span> {t("content.nonotification")}</span>
                    </div>
                    <div className="flex gap-2 s1024:justify-between mb-5">
                      <div className="notification-more hidden bg-red-600/80 text-white px-3 py-1 text-[12px] font-extralight">
                        <span> {t("content.showmore")}</span>
                      </div>
                      <div className="notification-clear hidden bg-gray-900/80 text-white px-3 py-1 text-[12px] font-extralight opacity-50 hover:opacity-100 rounded-full">
                        <span> {t("content.clearall")}</span>
                      </div>
                    </div>

                    <div
                        className="ps-scrollbar-x-rail"
                        style={{ left: "0px", bottom: "0px" }}
                    >
                      <div
                          className="ps-scrollbar-x"
                          tabIndex="0"
                          style={{ left: "0px", width: "0px" }}
                      ></div>
                    </div>
                    <div
                        className="ps-scrollbar-y-rail"
                        style={{ top: "0px", right: "0px" }}
                    >
                      <div
                          className="ps-scrollbar-y"
                          tabIndex="0"
                          style={{ top: "0px", height: "0px" }}
                      ></div>
                    </div>
                  </div>

                  <div className="loading animate-spin hidden"></div>
                </div>
            )}
          </div>
        </nav>
      </header>
  );
};

export default HeaderPage;