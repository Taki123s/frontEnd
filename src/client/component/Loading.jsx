import React from "react";
import loadingImage from "../../img/loading.gif";
import Modal from "react-modal";
export const Loading = ({ open = false }) => {
  const modalStyle = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "none",
      border: "none",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };
  return (
    <Modal
      title="Đang tải lên"
      isOpen={open}
      contentLabel="Đang tải lên"
      style={modalStyle}
    >
      <div
        style={{
          width: "300px",
          height: "300px",
          background: `url(${loadingImage}) no-repeat center center`,
          backgroundSize: "cover",
        }}
      ></div>
      <h2 style={{ color: "white" }}>Đang xử lý...</h2>
    </Modal>
  );
};
