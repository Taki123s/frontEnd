import React, { useEffect, useState } from "react";
import {
  getRoles,
  addRole,
} from "../../service/RoleServices";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { useParams, Link } from "react-router-dom";
import Modal from "react-modal";
import { RoleTable } from "./RoleTable";

Modal.setAppElement("#root");
export const RoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  useEffect(() => {
    getRoles()
      .then((response) => {
        console.log(response);
        setRoles(response.data);
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
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewRoleName("");
    setNewRoleDescription("");
  };

  const handleAddRole = () => {
    if(!newRoleName || newRoleName.trim()=="" || !newRoleDescription || newRoleDescription.trim()==""){
      Swal.fire({
        title: "Lỗi",
        text: "Không được bỏ trống tên vai trò",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    addRole({ name: newRoleName, description: newRoleDescription })
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: "Vai trò mới đã được thêm thành công.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setRoles((prevRoles) => [...prevRoles, response.data]);
        closeModal();
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

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="iq-card">
            <div
              className="iq-card-header d-flex justify-content-between"
              style={{ display: "flex" }}
            >
              <div className="iq-header-title">
                <h4 className="card-title">Danh sách vai trò</h4>
              </div>
              <Button
                variant="contained"
                color="success"
                style={{ float: "right" }}
                onClick={openModal}
              >
                New Role
              </Button>
            </div>
            <div className="iq-card-body">
              {roles?.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="table-responsive">
                      <RoleTable
                        idRole={item.id}
                        title={item.name}
                        data={item.userMap}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
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
            width: "400px",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
        contentLabel="Add Role"
      >
        {
          <div>
            <h2>Add Role</h2>
            <form>
            <div style={{ marginBottom: "10px" }}>
                <label htmlFor="name" name="labelName">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="descriptions" name="labelDescription">
                  Description:
                </label>
                <input
                  type="text"
                  name="descriptions"
                  id="descriptions"
                  required
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                id="saveAdd"
                name="saveAdd"
                onClick={handleAddRole}
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                id="cancelAdd"
                name="cancelAdd"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </form>
          </div>
        }
      </Modal>
    </>
  );
};
