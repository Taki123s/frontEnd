import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Checkbox } from "@mui/material";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Button from "@mui/material/Button";
import { parse, format } from "date-fns";
import Modal from "react-modal";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import {
  getAdminGenre,
  addGenre,
  editGenre,
  deleteGenre,
} from "../../service/CategoryServices";
export const ListGenre = () => {
  const [genres, setGenres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentAddData, setCurrentAddData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = genres.filter(
    (item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    getAdminGenre()
      .then((response) => {
        setGenres(response.data);
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

  const handleEdit = (row) => {
    setCurrentRow(row);
    setIsModalOpen(true);
  };
  const handleAdd = () => {
    setCurrentAddData("New Genre");
    setIsAddOpen(true);
  };
  const handleSaveAdd = () => {
    if (!currentAddData || currentAddData.trim() == "") {
      Swal.fire({
        title: "Lỗi",
        text: "Không được bỏ trống",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    const data = { description: currentAddData };
    addGenre(data)
      .then((response) => {
        setGenres([response.data, ...genres]);
        Swal.fire({
          title: "Thành công",
          text: `Thêm thể loại với mô tả ${currentAddData} thành công!`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsAddOpen(false);
        setCurrentAddData("New Genre");
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
  const handleDelete = (id) => {
    Swal.fire({
      title: "Xác nhận",
      html: `Bạn có đồng ý xóa thể loại với id: ${id} này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteGenre(id)
          .then((response) => {
            setGenres((prevGenres) =>
              prevGenres.filter((genre) => genre.id !== id)
            );
            Swal.fire({
              title: "Thành công",
              text: response.data,
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
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

  const handleSave = () => {
    const id = currentRow.id;
    const data = { description: currentRow.description };
    editGenre(id, data)
      .then((response) => {
        setGenres((prevGenres) =>
          prevGenres.map((genre) =>
            genre.id === response.data.id ? response.data : genre
          )
        );
        Swal.fire({
          title: "Thành công",
          text: "Sửa thành công",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsModalOpen(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCurrentRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };
  const columns = [
    {
      id: 1,
      name: "No",
      selector: (row, index) => index + 1,
      reorder: true,
    },
    {
      id: 2,
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      reorder: true,
    },
    {
      id: 3,
      name: "Description",
      cell: (row) => (
        <div
          data-tag="allowRowEvents"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          key={row.id}
          title={row.description}
        >
          {row.description}
        </div>
      ),
      sortable: true,
      reorder: true,
    },
    {
      id: 4,
      name: "Option",
      style: "word-wrap:unset;word-break:unset;",
      cell: (row) => (
        <div style={{ display: "flex" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "50%" }}
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            style={{ marginLeft: "20px", width: "50%" }}
            color="error"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const customTitle = (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Genre</h2>
        <Button variant="contained" color="success" onClick={handleAdd}>
          New Genre
        </Button>
      </div>
      <div>
        <TextField
          type="text"
          placeholder="Search By Description"
          style={{ marginBottom: "20px" }}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
  return (
    <div>
      <DataTable
        title={customTitle}
        columns={columns}
        data={Array.isArray(filteredItems) ? filteredItems : []}
        defaultSortFieldId={1}
        sortIcon={<ArrowDownward />}
        pagination
        paginationComponentOptions={paginationComponentOptions}
      />
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
        contentLabel="Edit Row"
      >
        {currentRow && (
          <div>
            <h2>Edit Row</h2>
            <form>
              <div style={{ marginBottom: "10px" }}>
                <label>Id:</label>
                <input
                  type="text"
                  name="id"
                  value={currentRow.id}
                  onChange={handleChange}
                  disabled
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  required
                  value={currentRow.description}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            </form>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isAddOpen}
        onRequestClose={() => setIsAddOpen(false)}
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
        contentLabel="Add Serie"
      >
        {
          <div>
            <h2>Add Genre</h2>
            <form>
              <div style={{ marginBottom: "10px" }}>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  required
                  value={currentAddData}
                  onChange={(e) => setCurrentAddData(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAdd}
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
            </form>
          </div>
        }
      </Modal>
    </div>
  );
};
