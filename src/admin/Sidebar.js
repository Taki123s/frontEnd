import React, { useState,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { refreshToken } from "../service/AuthServices";
const Sidebar = () => {
  const [menuState, setMenuState] = useState({
    dashboard: true,
    userinfo: false,
    movie: false,
    supplier: false,
    producer: false,
    tables: false,
    bonus: false,
    role: false,
    log: false,
    keys: false,
  });
  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = Cookies.get("jwt_token");
      if (token) {
        console.log("refresh")
        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();
        if (currentTime > expirationTime - 43200000) {
          try {
            refreshToken(token);
          } catch (error) {
          }
        }
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);
  const toggleMenu = (menu) => {
    setMenuState((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <div className="iq-sidebar">
      <div className="iq-navbar-logo d-flex justify-content-between">
        <a href="/" className="header-logo">
          <img src="../img/logonweb.png" className="img-fluid rounded" alt="" />
          <span>AnimeWeb</span>
        </a>
        <div className="iq-menu-bt align-self-center">
          <div className="wrapper-menu">
            <div className="main-circle">
              <i className="ri-menu-line"></i>
            </div>
            <div className="hover-circle">
              <i className="ri-close-fill"></i>
            </div>
          </div>
        </div>
      </div>
      <div id="sidebar-scrollbar">
        <nav className="iq-sidebar-menu">
          <ul id="iq-sidebar-toggle" className="iq-menu">
            <li className={menuState.dashboard ? "parentActive" : ""}>
              <a
                href="#dashboard"
                className="iq-waves-effect"
                onClick={() => toggleMenu("dashboard")}
                aria-expanded={menuState.dashboard}
              >

                <i className="las la-home iq-arrow-left"></i>
                <span>Bảng điều khiển</span>
                <i className="ri-arrow-right-s-line iq-arrow-right"></i>
                
              </a>
              <ul
                id="dashboard"
                className={`iq-submenu collapse ${
                  menuState.dashboard ? "show" : ""
                }`}
                data-parent="#iq-sidebar-toggle"
              >
                <li>
                  <Link to="/admin/Dashboard">
                    <i className="las la-laptop-code"></i>Thống kê
                  </Link>
                </li>
              </ul>
            </li>
            <li className="parentActive">
              <a href="https://analytics.google.com/analytics/web/#/p380852987/reports/reportinghub?params=_u..nav%3Dmaui%26_r.14..selmet%3D%5B%22conversions%22%5D"
                 target="_blank" className="iq-waves-effect"><span
                  className="ripple rippleEffect"></span><i
                  className="las la-user-tie iq-arrow-left"></i><span>Google Analytics</span></a>

            </li>

            <li className={menuState.userinfo ? "parentActive" : ""}>
              <Link to="/admin/DashBoard">
                <a
                  href="#userinfo"
                  className="iq-waves-effect"
                  onClick={() => toggleMenu("userinfo")}
                  aria-expanded={menuState.userinfo}
                >
                  <i className="las la-user-tie iq-arrow-left"></i>
                  <span>Quản lý người dùng</span>
                  <i className="ri-arrow-right-s-line iq-arrow-right"></i>
                </a>
              </Link>

              <ul
                id="userinfo"
                className={`iq-submenu collapse ${
                  menuState.userinfo ? "show" : ""
                }`}
                data-parent="#iq-sidebar-toggle"
              >
                <li>
                  <Link to="/admin/AddUser">
                    <i className="las la-plus-circle"></i>Thêm người dùng
                  </Link>
                </li>
                <li>
                  <Link to="/admin/UserList">
                    <i className="las la-th-list"></i>Danh sách người dùng
                  </Link>
                </li>
              </ul>
            </li>

            <li className={menuState.movie ? "parentActive" : ""}>
              <a
                href="#movie"
                className="iq-waves-effect"
                onClick={() => toggleMenu("movie")}
                aria-expanded={menuState.movie}
              >
                <i className="ri-pie-chart-box-line iq-arrow-left"></i>
                <span>Quản lý phim</span>
                <i className="ri-arrow-right-s-line iq-arrow-right"></i>
              </a>
              <ul
                id="movie"
                className={`iq-submenu collapse ${
                  menuState.movie ? "show" : ""
                }`}
                data-parent="#iq-sidebar-toggle"
              >
                <li>
                  <Link to="/admin/listMovie">
                    <i className="ri-folder-chart-2-line"></i>Danh sách phim
                  </Link>
                </li>
                <li>
                  <Link to="/admin/addMovie">
                    <i className="ri-folder-chart-2-line"></i>Nhập phim mới
                  </Link>
                </li>
                <li>
                  <Link to="/admin/listGenre">
                    <i className="ri-folder-chart-2-line"></i>Danh sách thể loại
                  </Link>
                </li>
                <li>
                  <Link to="/admin/listSerie">
                    <i className="ri-folder-chart-2-line"></i>Danh sách Serie
                  </Link>
                </li>
              </ul>
            </li>
            <li className={menuState.tables ? "parentActive" : ""}>
              <a
                href="#tables"
                className="iq-waves-effect"
                onClick={() => toggleMenu("tables")}
                aria-expanded={menuState.tables}
              >
                <i className="ri-table-line iq-arrow-left"></i>
                <span>Quản lý gói</span>
                <i className="ri-arrow-right-s-line iq-arrow-right"></i>
              </a>
              <ul
                id="tables"
                className={`iq-submenu collapse ${
                  menuState.tables ? "show" : ""
                }`}
                data-parent="#iq-sidebar-toggle"
              >
                <li>
                  <Link to="/admin/packed-service">
                    <i className="ri-table-line"></i>Danh sách các gói
                  </Link>
                </li>
                <li>
                  <Link to="/admin/user-packed">
                    <i className="ri-database-line"></i>Danh sách thành viên
                  </Link>
                </li>
              </ul>
            </li>
            <li className={menuState.role ? "parentActive" : ""}>
              <a
                href="#role"
                className="iq-waves-effect"
                onClick={() => toggleMenu("role")}
                aria-expanded={menuState.role}
              >
                <i className="ri-table-line iq-arrow-left"></i>
                <span>Quản lý vai trò</span>
                <i className="ri-arrow-right-s-line iq-arrow-right"></i>
              </a>
              <ul
                id="role"
                className={`iq-submenu collapse ${
                  menuState.role ? "show" : ""
                }`}
                data-parent="#iq-sidebar-toggle"
              >
                <li>
                  <Link to="/admin/roleManager">
                    <i className="ri-table-line"></i>Quản lý tổng
                  </Link>
                </li>
              </ul>
            </li>

          </ul>
        </nav>
        <div className="p-3"></div>
      </div>
    </div>
  );
};

export default Sidebar;
