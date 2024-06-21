import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import {
  faLock,
  faLockOpen,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"; // Import Font Awesome icons
import { getAllUser, deleteUser, lockUser } from "../../service/UserAdmin";

const UserList = () => {
  // State for list of accounts
  const [listAccount, setListAccount] = useState([]);
  const navigate = useNavigate();

  const data = async () => {
    const response = await getAllUser().catch((err) => console.log(err));
    setListAccount(response.data);
  };
  // Simulated data for demonstration
  useEffect(() => {
    data();
  }, []);

  // Event handlers
  const handleRemove = async (id) => {
    const response = await deleteUser(id).catch((err) => console.log(err));

    data();
  };

  const handleLock = async (id) => {
    // Handle lock action
    const response = await lockUser(id).catch((err) => console.log(err));

    data();
  };

  const handleEdit = (id) => {
    navigate(`/admin/EditUser/${id}`);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">Danh sách người dùng</h4>
              </div>
            </div>
            <div className="iq-card-body">
              <div className="table-responsive">
                <table
                  id="user-list-table"
                  className="table table-striped table-bordered mt-4"
                  style={{ textAlign: "center" }}
                >
                  <thead>
                    <tr>
                      <th>Ảnh đại diện</th>
                      <th>Tên người dùng</th>
                      <th>Tên tài khoản</th>
                      <th>Số điện thoại</th>
                      <th>Email</th>
                      <th>Loại tài khoản</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th>Ngày đăng ký</th>
                      <th>Tùy chỉnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listAccount?.map((item) => (
                      <tr key={item}>
                        <td className="text-center">
                          <img
                            className="rounded img-fluid avatar-40"
                            src={item.avatarPicture}
                            alt="profile"
                          />
                        </td>
                        <td>{item.fullName}</td>
                        <td>{item.userName}</td>
                        <td>{item.phone}</td>
                        <td>{item.email}</td>
                        <td>{item.userType}</td>
                        <td>
                          {item.roles?.map((role, index) => (
                            <div key={index}>
                              <p>{role.description}</p>
                            </div>
                          ))}
                        </td>
                        <td>
                          <div id={`renderIsActive${item.id}`}>
                            <span
                              className={`badge ${
                                item.isActive ? "iq-bg-success" : "iq-bg-danger"
                              }`}
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td>{item.createdAt}</td>
                        <td>
                          <div
                            className="flex align-items-center list-user-action"
                            style={{ float: "left !important" }}
                          >
                            {!item.isActive ? (
                              <>
                                <button
                                  className="btn text-success"
                                  onClick={() => handleLock(item.id)}
                                >
                                  <FontAwesomeIcon icon={faLockOpen} />
                                </button>
                                <button
                                  className="btn text-danger"
                                  onClick={() => handleLock(item.id)}
                                  style={{ display: "none" }}
                                >
                                  <FontAwesomeIcon icon={faLock} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn text-success"
                                  onClick={() => handleLock(item.id)}
                                  style={{ display: "none" }}
                                >
                                  <FontAwesomeIcon icon={faLockOpen} />
                                </button>
                                <button
                                  className="btn text-danger"
                                  onClick={() => handleLock(item.id)}
                                >
                                  <FontAwesomeIcon icon={faLock} />
                                </button>
                              </>
                            )}
                            <button
                              className="btn text-primary"
                              onClick={() => handleEdit(item.id)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="btn text-danger"
                              onClick={() => handleRemove(item.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default UserList;
