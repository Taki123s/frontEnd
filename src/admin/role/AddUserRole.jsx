import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Modal from "react-modal";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";

export const AddUserRole = ({
  isOpen,
  onRequestClose,
  idRole,
  getUsersNotHaveRole,
  addRoleUser,
  setUsers,
}) => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      getUsersNotHaveRole(idRole)
        .then((response) => {
          setUserData(response.data);
          setFilteredData(response.data);
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
    }
  }, [isOpen, idRole, getUsersNotHaveRole]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = userData.filter((user) =>
      user.userName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const addUserRole = (row) => {
    addRoleUser(idRole, row.id)
      .then((response) => {
        Swal.fire({
          title: "Thành công!",
          text: response.data,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        const updatedUserData = userData.filter((user) => user.id !== row.id);
        const updatedFilteredData = filteredData.filter(
          (user) => user.id !== row.id
        );
        setUserData(updatedUserData);
        setFilteredData(updatedFilteredData);
        setUsers((prevUsers) => [
          ...prevUsers,
          { id: row.id, name: row.userName },
        ]);
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
      selector: (row) => row.userName,
      sortable: true,
      reorder: true,
    },
    {
      id: 4,
      name: "Option",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <span className="table-remove">
            <Button onClick={() => addUserRole(row)}>
              <i className="btn iq-bg-success fa fa-plus-circle"></i>
            </Button>
          </span>
        </div>
      ),
    },
  ];

  const handleCloseModal = () => {
    onRequestClose();
    setUserData([]);
    setFilteredData([]);
    setSearchTerm("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      style={{
        overlay: {
          backgroundColor: "rgb(121 127 222 / 50%)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "100vh",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <TextField
        type="text"
        placeholder="Search User Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />
      <DataTable
        title={"Danh sách người dùng có thể thêm"}
        columns={columns}
        defaultSortFieldId={1}
        sortIcon={<ArrowDownward />}
        pagination
        data={Array.isArray(filteredData) ? filteredData : []}
      />
    </Modal>
  );
};
