import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { TextField, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useParams, Link } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  getMovieChapters,
  uploadChapter,
  editChapter,
  addChapter,
  deleteChapter,
} from "../../service/MovieServices";
import { parse } from "date-fns";
import { Loading } from "../../client/component/Loading";
import ProgressBar from "@ramonak/react-progress-bar";
Modal.setAppElement("#root");

export const ChapterMovie = () => {
  const { idMovie } = useParams();
  const [chapters, setChapters] = useState([]);
  const [editedChapters, setEditedChapters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("url");
  const [excelData, setExcelData] = useState(null);
  const [urlInputOption, setUrlInputOption] = useState("enterUrl");
  const [newChapterData, setNewChapterData] = useState({
    ordinal: "",
    link: "",
    videoFile: null,
  });
  const handleUrlInputOptionChange = (event) => {
    setUrlInputOption(event.target.value);
    if (event.target.value == "enterUrl") {
      setExcelData(null);
    } else {
      setNewChapterData({
        ...newChapterData,
        link: "",
      });
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setNewChapterData({
      ...newChapterData,
      videoFile: file,
    });
  };
  useEffect(() => {
    getMovieChapters(idMovie)
      .then((response) => {
        setChapters(response.data);
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
  }, [idMovie]);

  const handleEditChange = (id, field, value) => {
    setEditedChapters((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [field]: value,
      },
    }));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewChapterData({
      ordinal: "",
      link: "",
      videoFile: null,
    });
  };
  const closeEditMode = (id) => {
    setEditedChapters((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        edit: false,
      },
    }));
  };

  const handleEdit = (id) => {
    setEditedChapters((prevState) => ({
      ...prevState,
      [id]: {
        ...chapters.find((chapter) => chapter.id === id),
        isUploadingNewVideo: false,
        editingUrl: true,
        edit: true,
      },
    }));
  };

  const handleSave = (id) => {
    const chapter = editedChapters[id];
    if (
      chapter.ordinal == "".trim() ||
      chapter.ordinal == null ||
      chapter.link == null
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
    if (chapter.editingUrl) {
      if (chapter.link.trim() == "") {
        Swal.fire({
          title: "Lỗi",
          text: "Không được bỏ trống",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      editChapter(idMovie, id, chapter)
        .then((response) => {
          Swal.fire({
            title: "Thành công",
            text: "Chỉnh sửa thành công",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          setChapters((prevChapters) =>
            prevChapters.map((ch) => (ch.id === id ? response.data : ch))
          );
          closeEditMode(id);
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
    } else if (chapter.isUploadingNewVideo) {
      const formData = new FormData();
      formData.append("ordinal", chapter.ordinal);
      formData.append("video", chapter.link);
      uploadChapter(idMovie, id, formData, (data) => {
        setEditedChapters((prevState) => ({
          ...prevState,
          [id]: {
            ...prevState[id],
            isUploadingNewVideo: true,
            uploadProgress: 0,
            isVideoLoading: true,
            uploadProgress: Math.round((100 * data.loaded) / data.total),
          },
        }));
      })
        .then((response) => {
          Swal.fire({
            title: "Thành công",
            text: "Tải lên video thành công",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          setChapters((prevChapters) =>
            prevChapters.map((ch) => (ch.id === id ? response.data : ch))
          );
          setEditedChapters((prevState) => ({
            ...prevState,
            [id]: {
              ...prevState[id],
              isVideoLoading: false,
            },
          }));
          closeEditMode(id);
        })
        .catch((error) => {
          setEditedChapters((prevState) => ({
            ...prevState,
            [id]: {
              ...prevState[id],
              isVideoLoading: false,
            },
          }));
          Swal.fire({
            title: "Lỗi",
            text: error.response?.data.message || "Unknown error occurred",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        });
    }
  };

  const handleAdd = () => {
    const formData = new FormData();
    formData.append("ordinal", newChapterData.ordinal);
    if (selectedOption == "url") {
      let link = newChapterData.link;
      if (!link && !excelData) {
        Swal.fire({
          title: "Lỗi",
          text: 'Hãy nhập url hoặc tải lên file excel với 2 cột là "ordinal" và "url"',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      if (urlInputOption == "uploadExcel") {
        formData.append("type", 2);
        for (const [key, value] of Object.entries(excelData)) {
          formData.append(`excelData[${key}]`, value);
        }
      } else {
        if (!newChapterData.ordinal || newChapterData.ordinal.trim() == "") {
          Swal.fire({
            title: "Lỗi",
            text: "Không được bỏ trống",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          return;
        }
        formData.append("type", 1);
        formData.append("link", link);
      }
      setIsUploading(true);
      addChapter(idMovie, formData)
        .then((response) => {
          setIsUploading(false);
          Swal.fire({
            title: "Thành công",
            text: "Thêm chapter mới thành công!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          setChapters((prevChapters) => [...prevChapters, ...response.data]);
          handleModalClose();
        })
        .catch((error) => {
          setIsUploading(false);
          Swal.fire({
            title: "Lỗi",
            text: error.response?.data.message || "Unknown error occurred",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        });
    } else {
      if (
        !newChapterData.videoFile ||
        !newChapterData.ordinal ||
        newChapterData.ordinal.trim() == ""
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
      formData.append("type", 3);
      formData.append("video", newChapterData.videoFile);
      setIsUploading(true);
      addChapter(idMovie, formData)
        .then((response) => {
          setIsUploading(false);
          Swal.fire({
            title: "Thành công",
            text: "Thêm chapter mới thành công!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          setChapters((prevChapters) => [...prevChapters, ...response.data]);
          handleModalClose();
        })
        .catch((error) => {
          setIsUploading(false);
          Swal.fire({
            title: "Lỗi",
            text: error.response?.data.message || "Unknown error occurred",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        });
    }
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
      name: "Index",
      cell: (row) =>
        editedChapters[row.id]?.edit ? (
          <input
            type="number"
            value={editedChapters[row.id]?.ordinal ?? ""}
            onChange={(e) =>
              handleEditChange(row.id, "ordinal", e.target.value)
            }
          />
        ) : (
          row.ordinal
        ),
      sortable: true,
      reorder: true,
      selector: (row) => row.ordinal,
    },
    {
      id: 4,
      name: "Url",
      cell: (row) => {
        if (
          editedChapters[row.id]?.edit &&
          editedChapters[row.id]?.isUploadingNewVideo
        ) {
          return (
            <div style={{ width: "100%" }}>
              {!editedChapters[row.id]?.isVideoLoading && (
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleEditChange(row.id, "link", e.target.files[0])
                  }
                  style={{ width: "100%" }}
                />
              )}
              {editedChapters[row.id]?.isVideoLoading && (
                <ProgressBar
                  completed={editedChapters[row.id]?.uploadProgress || 0}
                  customLabel={
                    editedChapters[row.id]?.uploadProgress == 100
                      ? "Đang xử lý"
                      : ""
                  }
                  labelColor="white"
                  labelSize="15px"
                  labelAlignment="center"
                  baseBgColor="rgb(184 183 183 / 86%)"
                  bgColor="rgb(241 19 109)"
                  margin="15px 0px 15px 0px"
                />
              )}
            </div>
          );
        } else if (
          editedChapters[row.id]?.edit &&
          editedChapters[row.id]?.editingUrl
        ) {
          return (
            <input
              type="text"
              value={editedChapters[row.id]?.link || ""}
              onChange={(e) => handleEditChange(row.id, "link", e.target.value)}
              style={{ width: "100%" }}
            />
          );
        } else {
          return (
            <Link
              to={row.link}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row.link}
            </Link>
          );
        }
      },
      sortable: true,
      reorder: true,
    },
    {
      id: 5,
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
      id: 6,
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
        const dateA = parse(a.updateAt, "hh:mm:ss a dd/MM/yyyy", new Date());
        const dateB = parse(b.updateAt, "hh:mm:ss a dd/MM/yyyy", new Date());
        return dateA - dateB;
      },
      reorder: true,
    },
    {
      id: 7,
      name: "Option",
      cell: (row) => (
        <div style={{ display: "flex" }}>
          {editedChapters[row.id]?.edit ? (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{ wordBreak: "keep-all" }}
                onClick={() => handleSave(row.id)}
                disabled={editedChapters[row.id]?.isVideoLoading}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                style={{ marginLeft: "5px", wordBreak: "keep-all" }}
                onClick={() => closeEditMode(row.id)}
                disabled={editedChapters[row.id]?.isVideoLoading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "33%" }}
                onClick={() => handleEdit(row.id)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="success"
                style={{
                  marginLeft: "5px",
                  width: "33%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onClick={() => handleUploadVideo(row.id)}
              >
                New Video
              </Button>
              <Button
                variant="contained"
                color="error"
                style={{
                  marginLeft: "5px",
                  width: "33%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onClick={() => handleDelete(row.id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const handleUploadVideo = (id) => {
    closeEditMode(id);
    setEditedChapters((prevState) => ({
      ...prevState,
      [id]: {
        ...chapters.find((chapter) => chapter.id === id),
        isUploadingNewVideo: true,
        editingUrl: false,
        edit: true,
      },
    }));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Xác nhận!",
      text: `Bạn có đồng ý xóa chapter với id: ${id} này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsUploading(true);
        deleteChapter(idMovie, id)
          .then(() => {
            setIsUploading(false);
            Swal.fire({
              title: "Đã xóa!",
              text: "Đã xóa thành công.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            setChapters((prevChapters) =>
              prevChapters.filter((chapter) => chapter.id !== id)
            );
          })
          .catch((error) => {
            setIsUploading(false);
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

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };

  const handleAddChapter = () => {
    setIsModalOpen(true);
  };

  const customTitle = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>Chapters</h2>
      <Button variant="contained" color="success" onClick={handleAddChapter}>
        New Chapter
      </Button>
    </div>
  );
  const handleUrlFile = (e) => {
    const f = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryString = evt.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      if (
        !jsonData.length ||
        !jsonData[0].hasOwnProperty("ordinal") ||
        !jsonData[0].hasOwnProperty("url")
      ) {
        Swal.fire({
          title: "Lỗi",
          text: 'Dữ liệu cần phải có cột "ordinal" và "url" ',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setExcelData(null);
        return;
      }
      const excelDataMap = jsonData.reduce((map, row) => {
        if (row.ordinal && row.url) {
          map[row.ordinal] = row.url;
        }
        return map;
      }, {});
      setExcelData(excelDataMap);
    };
    reader.readAsBinaryString(f);
  };
  return (
    <div>
      <Loading open={isUploading} />
      <DataTable
        title={customTitle}
        columns={columns}
        data={Array.isArray(chapters) ? chapters : []}
        defaultSortFieldId={1}
        sortIcon={<ArrowDownward />}
        pagination
        paginationComponentOptions={paginationComponentOptions}
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div style={{ padding: "20px", backgroundColor: "#fff" }}>
          <h3>Add New Chapter</h3>
          {!(urlInputOption == "uploadExcel" && selectedOption == "url") && (
            <TextField
              label="Index"
              value={newChapterData.ordinal}
              onChange={(e) =>
                setNewChapterData({
                  ...newChapterData,
                  ordinal: e.target.value,
                })
              }
              type="number"
              fullWidth
              style={{ marginBottom: "20px" }}
            />
          )}
          <RadioGroup
            row
            aria-label="chapterType"
            name="chapterType"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <FormControlLabel value="url" control={<Radio />} label="Add URL" />
            <FormControlLabel
              value="video"
              control={<Radio />}
              label="Add New Video"
            />
          </RadioGroup>
          {selectedOption === "url" ? (
            <>
              <FormControl
                component="fieldset"
                style={{ marginBottom: "20px" }}
              >
                <FormLabel component="legend">
                  Select URL Input Method
                </FormLabel>
                <RadioGroup
                  row
                  value={urlInputOption}
                  onChange={handleUrlInputOptionChange}
                >
                  <FormControlLabel
                    value="enterUrl"
                    control={<Radio />}
                    label="Enter URL"
                  />
                  <FormControlLabel
                    value="uploadExcel"
                    control={<Radio />}
                    label="Upload Excel File"
                  />
                </RadioGroup>
              </FormControl>

              {urlInputOption === "enterUrl" ? (
                <TextField
                  label="URL"
                  value={newChapterData.link}
                  onChange={(e) =>
                    setNewChapterData({
                      ...newChapterData,
                      link: e.target.value,
                    })
                  }
                  fullWidth
                  style={{ marginBottom: "20px" }}
                />
              ) : (
                <div>
                  <Button
                    variant="contained"
                    component="label"
                    style={{ marginBottom: "20px" }}
                  >
                    Upload Excel File
                    <input
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      hidden
                      onChange={handleUrlFile}
                    />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              style={{ marginBottom: "20px" }}
            />
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleModalClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
