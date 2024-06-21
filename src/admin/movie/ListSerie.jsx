import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Checkbox } from "@mui/material";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import {
  getAllSerie,
  addSerie,
  editSerie,
  deleteSerie,
} from "../../service/SerieServices";
import Button from "@mui/material/Button";
import { parse, format } from "date-fns";
import Modal from "react-modal";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";

Modal.setAppElement("#root");
export const ListSerie = () => {
  const [series, setSeries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentAddData, setCurrentAddData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const filteredItems = series.filter(
    (item) =>
      item.descriptions.toLowerCase().includes(searchText.toLowerCase())
  );
  useEffect(() => {
    getAllSerie()
      .then((response) => {
        setSeries(response.data);
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
    setCurrentAddData("New Serie");
    setIsAddOpen(true);
  };
  const handleSaveAdd = () => {
    const data = { descriptions: currentAddData };
    addSerie(data)
      .then((response) => {
        setSeries([response.data, ...series]);
        Swal.fire({
          title: "Thành công",
          text: `Thêm serie với mô tả ${currentAddData} thành công!`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsAddOpen(false);
        setCurrentAddData("New Serie");
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
      html: `Bạn có đồng ý xóa Serie với id: ${id} này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSerie(id)
          .then((response) => {
            setSeries((prevSeries) =>
              prevSeries.filter((serie) => serie.id !== id)
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
    const data = { descriptions: currentRow.descriptions };
    editSerie(id, data)
      .then((response) => {
        setSeries((prevSeries) =>
          prevSeries.map((serie) =>
            serie.id === response.data.id ? response.data : serie
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
          title={row.descriptions}
        >
          {row.descriptions}
        </div>
      ),
      sortable: true,
      reorder: true,
    },
    {
      id: 4,
      name: "Create At",
      cell: (row) => (
        <div
          data-tag="allowRowEvents"
          style={{
            whiteSpace: "wrap",
            overflow: "unset",
            textOverflow: "unset",
          }}
          key={row.id}
        >
          {row.createAt}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const dateA = parse(a.createAt, "hh:mm:ss a dd/MM/yyyy", new Date());
        const dateB = parse(b.createAt, "hh:mm:ss a dd/MM/yyyy", new Date());
        return dateA - dateB;
      },
      reorder: true,
    },
    {
      id: 5,
      name: "Update At",
      cell: (row) => (
        <div
          data-tag="allowRowEvents"
          style={{
            whiteSpace: "wrap",
            overflow: "unset",
            textOverflow: "unset",
          }}
          key={row.id}
        >
          {row.updateAt}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const dateA = parse(a.createAt, "hh:mm:ss a dd/MM/yyyy", new Date());
        const dateB = parse(b.createAt, "hh:mm:ss a dd/MM/yyyy", new Date());
        return dateA - dateB;
      },
      reorder: true,
    },
    {
      id: 6,
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
      <h2>Series</h2>
      <Button variant="contained" color="success" onClick={handleAdd}>
        New Serie
      </Button>
    </div>
    <div>
    <TextField
        type="text"
        placeholder="Search By Description"
        variant="outlined"
        margin="normal"
        value={searchText}
        style={{ display: "block" }}
        onChange={(e) => setSearchText(e.target.value)}
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
                  name="descriptions"
                  required
                  value={currentRow.descriptions}
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
            <h2>Add Serie</h2>
            <form>
              <div style={{ marginBottom: "10px" }}>
                <label>Description:</label>
                <input
                  type="text"
                  name="descriptions"
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
