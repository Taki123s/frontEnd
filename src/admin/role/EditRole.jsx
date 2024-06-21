import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { useParams, Link } from "react-router-dom";
import {
  getRoleById,
  getEnablePermission,
  addRolePermission,
  deleteRolePermission,
  editRole,
} from "../../service/RoleServices";
export const EditRole = () => {
  const { roleId } = useParams();
  const [enablePermission, setEnablePermission] = useState([]);
  const [oldPermission, setOldPermission] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempRoleName, setTempRoleName] = useState(roleName);
  const [tempRoleDescription, setTempRoleDescription] =
    useState(roleDescription);

  useEffect(() => {
    getRoleById(roleId)
      .then((response) => {
        const roleData = response.data;
        setRoleName(roleData.name);
        setOldPermission(roleData.permissions);
        setRoleDescription(roleData.description);
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
  }, [roleId]);
  useEffect(() => {
    getEnablePermission(roleId)
      .then((response) => {
        setEnablePermission(response.data);
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
  }, [roleId]);
  const oldColumns = [
    {
      id: 2,
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      reorder: true,
    },
    {
      id: 3,
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      reorder: true,
    },
    {
      id: 4,
      name: "Desciption",
      selector: (row) => row.description,
      sortable: true,
      reorder: true,
    },
    {
      id: 5,
      name: "Option",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <span className="table-remove">
            <Button onClick={() => removePermission(row)}>
              <i className="btn iq-bg-danger fa fa-minus-circle"></i>
            </Button>
          </span>
        </div>
      ),
    },
  ];
  const enableColumns = [
    {
      id: 2,
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      reorder: true,
    },
    {
      id: 3,
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      reorder: true,
    },
    {
      id: 4,
      name: "Desciption",
      selector: (row) => row.description,
      sortable: true,
      reorder: true,
    },
    {
      id: 5,
      name: "Option",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <span className="table-remove">
            <Button onClick={() => addPermission(row)}>
              <i className="btn iq-bg-success fa fa-plus-circle"></i>
            </Button>
          </span>
        </div>
      ),
    },
  ];
  const addPermission = (row) => {
    Swal.fire({
      title: "Xác nhận!",
      text: `Bạn có đồng ý thêm quyền này vào role?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        addRolePermission(roleId, row.id)
          .then(() => {
            Swal.fire({
              title: "Success!",
              text: "Đã thêm thành công.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            setEnablePermission((prevPermissions) =>
              prevPermissions.filter((permissions) => permissions.id !== row.id)
            );
            setOldPermission((prevPermissions) => [...prevPermissions, row]);
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

  const removePermission = (row) => {
    Swal.fire({
      title: "Xác nhận!",
      text: `Bạn có đồng ý xóa quyền này khỏi role?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRolePermission(roleId, row.id)
          .then(() => {
            Swal.fire({
              title: "Success!",
              text: "Đã xóa thành công.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });

            setOldPermission((prevPermissions) =>
              prevPermissions.filter((permission) => permission.id !== row.id)
            );
            setEnablePermission((prevPermissions) => [...prevPermissions, row]);
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
  const handleEdit = () => {
    setIsEditing(true);
    setTempRoleName(roleName);
    setTempRoleDescription(roleDescription);
  };

  const handleSave = () => {
    if (
      !tempRoleName ||
      tempRoleName.trim() == "" ||
      !tempRoleDescription ||
      tempRoleDescription.trim() == ""
    ) {
      Swal.fire({
        title: "Lỗi",
        text: "Không được bỏ trống",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    const data = { name: tempRoleName, description: tempRoleDescription };
    editRole(roleId, data)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: response.data,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setRoleName(tempRoleName);
        setRoleDescription(tempRoleDescription);
        setIsEditing(false);
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

  const handleCancel = () => {
    setIsEditing(false);
    setTempRoleName(roleName);
    setTempRoleDescription(roleDescription);
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="iq-header-title">
                <h4 className="card-title">Chỉnh sửa quyền hạn</h4>
              </div>
            </div>
            <div className="iq-card-body">
              <div className="new-user-info">
                <div className="row">
                  <div className="form-group col-md-6">
                    <div
                      style={{
                        border: "3px solid #19e0e0",
                        display: "inline-block",
                        padding: "20px",
                      }}
                    >
                      {isEditing ? (
                        <>
                          <h3>
                            Vai trò đang sửa :
                            <input
                              type="text"
                              value={tempRoleName}
                              onChange={(e) => setTempRoleName(e.target.value)}
                              autoFocus
                            />
                          </h3>
                          <h4>
                            Mô tả:
                            <input
                              type="text"
                              value={tempRoleDescription}
                              onChange={(e) =>
                                setTempRoleDescription(e.target.value)
                              }
                            />
                          </h4>
                          <Button
                            className="btn iq-bg-danger btn-rounded btn-sm my-0"
                            onClick={handleCancel}
                            style={{ float: "right" }}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="btn iq-bg-info btn-rounded btn-sm my-0"
                            onClick={handleSave}
                            style={{
                              float: "right",
                              marginLeft: "10px",
                              marginRight: "20px",
                            }}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <h3>Vai trò đang sửa : {roleName}</h3>
                          <h4>Mô tả: {roleDescription}</h4>
                          <Button
                            className="btn iq-bg-info btn-rounded btn-sm my-0"
                            onClick={handleEdit}
                            style={{ float: "right" }}
                          >
                            <i className="ri-pencil-line"></i>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="container" style={{ maxWidth: "100%" }}>
                    <div className="row">
                      <div className="col-md-6">
                        <h4>Quyền hạn đang có</h4>
                        <div
                          style={{
                            border: "3px solid #19e0e0",
                            margin: "30px 0px",
                          }}
                        >
                          <DataTable
                            columns={oldColumns}
                            data={
                              Array.isArray(oldPermission) ? oldPermission : []
                            }
                            defaultSortFieldId={1}
                            sortIcon={<ArrowDownward />}
                            pagination
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h4>Quyền hạn có thể có</h4>
                        <div
                          style={{
                            border: "3px solid #19e0e0",
                            margin: "30px 0px",
                          }}
                        >
                          <DataTable
                            columns={enableColumns}
                            data={
                              Array.isArray(enablePermission)
                                ? enablePermission
                                : []
                            }
                            defaultSortFieldId={1}
                            sortIcon={<ArrowDownward />}
                            pagination
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
