import React from 'react';
// import "../css/admin.css";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import 'line-awesome/dist/line-awesome/css/line-awesome.min.css'; // Import Line Awesome CSS
// import 'remixicon/fonts/remixicon.css'; // Import Remix Icon CSS

const Dashboard = "/admin/dashBoard";
const UserList = "/admin/UserList";
const UserEdit = "/admin/UserEdit";


const Navbar = () => {
    return (
        <div className="iq-top-navbar">
            <div className="iq-navbar-custom">
                <nav className="navbar navbar-expand-lg navbar-light p-0">
                    <div className="iq-menu-bt d-flex align-items-center">
                        <div className="wrapper-menu">
                            <div className="main-circle"><i className="ri-menu-line"></i></div>
                            <div className="hover-circle"><i className="ri-close-fill"></i></div>
                        </div>
                        <div className="iq-navbar-logo d-flex justify-content-between ml-3">
                            <a href={Dashboard} className="header-logo">
                                <img src="../img/logonweb.png" className="img-fluid rounded" alt="" />
                                <div>Admin AnimeWeb</div>
                            </a>
                        </div>
                    </div>

                    <ul className="navbar-list">
                        <li className="line-height">
                            <a href="#" className="search-toggle iq-waves-effect d-flex align-items-center">
                                <div className="caption">
                                    <img className="img-fluid rounded" alt="" style={{ width: "80px" }} />
                                    <p className="mb-0">Manager</p>
                                </div>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;