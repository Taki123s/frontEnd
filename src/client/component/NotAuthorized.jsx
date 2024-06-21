import React from "react";
import error from "../../img/error.png";
export const NotAuthorized = () => {
  return (
    <div
      id="ah_wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "50px", fontWeight: "1000" }}>
        Không đủ quyền truy cập
      </h1>
      <img src={error} width={"500px"} height={"500px"} alt="Error" />
    </div>
  );
};
