import React, { useState } from "react";
import axios from "axios";
import "../../css/ForgotPassword.css";
import Swal from "sweetalert2"; // Ensure you have the CSS file
import { Loading } from "./Loading";
function ForgotPassword() {
  const [isUploading, setIsUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { email };
    setIsUploading(true);
    axios
      .post("https://backend-w87n.onrender.com/auth/forget-password", data)
      .then((response) => {
        setIsUploading(false);
        setSubmitted(true);
        Swal.fire({
          icon: "success",
          title: response.data,
          text: `Success`,
        });
      })
      .catch((error) => {
        setIsUploading(false);
        console.error(error);
      });
  };

  return (
    <div id="ah_wrapper">
      <Loading open={isUploading} />
      <section className="product spad">
        <div className="container">
          <form onSubmit={handleSubmit} className="forgot-password-form">
            {!submitted ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="email-input"
                  required
                />
                <button type="submit" className="submit-button">
                  Gửi email đặt lại mật khẩu
                </button>
              </>
            ) : (
              <div className="confirmation-message">
                <span className="check-icon">✔</span>
                Đã gửi qua email, vui lòng kiểm tra
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
