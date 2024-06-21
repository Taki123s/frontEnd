import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import AddUserForm from "./user/AddUser";
import ServicePacks from "./component/packed-service";

import UserPacked from "./component/user-packed";
import "boxicons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ChapterMovie } from "./movie/ChapterMovie";
import { ListSerie } from "./movie/ListSerie";
import { ListMovie } from "./movie/ListMovie";
import { AddMovie } from "./movie/AddMovie";
import { EditRole } from "./role/EditRole";
import { RoleManager } from "./role/RoleManager";
import { ListGenre } from "./movie/ListGenre";
import { EditMovie } from "./movie/EditMovie";
import UserAdd from "./user/AddUser";
import UserList from "./user/ListUser";
import EditUser from "./user/EditUser";
import DashBoard from "./Dashboard";
import "jquery-confirm";
import "../css/bootstrap.min.css";
import "./css/style.css";
import "./css/main.css";
import "./images/favicon.ico";
import "./css/typography.css";
import "./css/responsive.css";
import PrivateRoute from "./component/PrivateRouter";
import AdminLayout from "./component/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Sidebar />
        <div className="content-page" id="content-page">
          <div className="container-fluid">
            <Routes>
              <Route
                element={
                  <PrivateRoute roles={["ROLE_ADMIN", "view_dashboard"]} />
                }
              >
                <Route path="/admin/*" element={<AdminLayout />}>
                  <Route path="DashBoard" element={<DashBoard />} />

                  {/* role */}
                  <Route
                    element={
                      <PrivateRoute roles={["ROLE_ADMIN", "view_roles"]} />
                    }
                  >
                    <Route path="editRole/:roleId" element={<EditRole />} />
                    <Route path="roleManager" element={<RoleManager />} />
                  </Route>

                  {/* movie */}
                  <Route
                    element={
                      <PrivateRoute roles={["ROLE_ADMIN", "view_movies"]} />
                    }
                  >
                    <Route
                      path="chapterList/:idMovie"
                      element={<ChapterMovie />}
                    />
                    <Route path="listMovie" element={<ListMovie />} />
                    <Route path="addMovie" element={<AddMovie />} />
                    <Route path="editMovie/:movieId" element={<EditMovie />} />
                  </Route>
                  {/* genre */}
                  <Route
                    element={
                      <PrivateRoute roles={["ROLE_ADMIN", "view_genres"]} />
                    }
                  >
                    <Route path="listGenre" element={<ListGenre />} />
                  </Route>
                  {/* serie */}
                  <Route
                    element={
                      <PrivateRoute roles={["ROLE_ADMIN", "view_series"]} />
                    }
                  >
                    <Route path="listSerie" element={<ListSerie />} />
                  </Route>
                  {/* service */}
                  <Route
                    element={
                      <PrivateRoute roles={["ROLE_ADMIN", "view_services"]} />
                    }
                  >
                  <Route path="packed-service" element={<ServicePacks />} />
                  <Route path="user-packed" element={<UserPacked />} />

                  </Route>
                  {/* user */}
                  <Route
                    element={
                      <PrivateRoute roles={["ROLE_ADMIN", "view_users"]} />
                    }
                  >
                  <Route path="adduser" element={<UserAdd />} />
                  <Route path="UserList" element={<UserList />} />
                  <Route path="EditUser/:id" element={<EditUser />} />
                  <Route path="add" element={<AddUserForm />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
