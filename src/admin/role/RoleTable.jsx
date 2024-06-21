import React, { useEffect, useState } from "react";
import {
  getRoles,
  deleteUserRole,
  deleteRole,
  addRole,
  getUsersNotHaveRole,
  addRoleUser,
} from "../../service/RoleServices";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { useParams, Link } from "react-router-dom";
import { AddUserRole } from "./AddUserRole";
import TextField from "@mui/material/TextField";

export const RoleTable = ({ idRole, title, data }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const usersArray = Object.keys(data).map((key) => ({
      id: key,
      name: data[key],
    }));
    setUsers(usersArray);
    setFilteredUsers(usersArray);
  }, [data]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleRemoveRole = () => {
    Swal.fire({
      title: "Xác nhận!",
      text: `Bạn có đồng ý xóa không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRole(idRole)
          .then((response) => {
            Swal.fire({
              title: "Đã xóa!",
              text: response.data,
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            setIsDeleted(true);
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
      }
    });
  };

  const handleRemoveUserRole = (row) => {
    Swal.fire({
      title: "Xác nhận!",
      text: `Bạn có đồng ý xóa không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserRole(idRole, row.id)
          .then((response) => {
            Swal.fire({
              title: "Đã xóa!",
              text: response.data,
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== row.id)
            );
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
      }
    });
  };

  const handleAddUser = (idRole) => {
    setShowModal(true);
  };

  const columns = [
    {
      id: 1,
      name: "No",
      selector: (row, index) => index + 1,
    },
    {
      id: 2,
      name: "Id User",
      selector: (row) => row.id,
      sortable: true,
      reorder: true,
    },
    {
      id: 3,
      name: "Username",
      selector: (row) => row.name,
      sortable: true,
      reorder: true,
    },
    {
      id: 4,
      name: "Option",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <span className="table-remove">
            <Button onClick={() => handleRemoveUserRole(row)}>
              <i className="btn iq-bg-danger fa fa-minus-circle"></i>
            </Button>
          </span>
        </div>
      ),
    },
  ];

  const customTitle = (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          overflowX: "scroll",
          whiteSpace: "nowrap",
        }}
      >
        <h2>{title}</h2>
        <div>
          <Link
            className="btn iq-bg-success btn-rounded btn-sm my-0"
            onClick={() => handleAddUser(idRole)}
          >
            <i className="fa fa-plus-circle"></i>
          </Link>
          <Link
            className="btn iq-bg-info btn-rounded btn-sm my-0"
            to={`/admin/editRole/${idRole}`}
          >
            <i className="ri-pencil-line"></i>
          </Link>
          {title !== "USER" && (
            <Link
              className="btn iq-bg-danger btn-rounded btn-sm my-0"
              onClick={handleRemoveRole}
            >
              <i className="ri-delete-bin-line"></i>
            </Link>
          )}
        </div>
      </div>
      <TextField
        type="text"
        placeholder="Search User Name"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        style={{ display: "block" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );

  if (isDeleted) return null;

  return (
    <div style={{ border: "3px solid #19e0e0", margin: "30px 0px" }}>
      <DataTable
        title={customTitle}
        columns={columns}
        defaultSortFieldId={1}
        sortIcon={<ArrowDownward />}
        pagination
        data={Array.isArray(filteredUsers) ? filteredUsers : []}
      />
      <AddUserRole
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        idRole={idRole}
        getUsersNotHaveRole={getUsersNotHaveRole}
        addRoleUser={addRoleUser}
        setUsers={setUsers}
      />
    </div>
  );
};
