import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const ExecutePaymentComponent = () => {
  const location = useLocation();
  const hasExecuted = useRef(false);

  useEffect(() => {
    const executePayment = async () => {
      if (hasExecuted.current) return;
      hasExecuted.current = true;

      try {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get("paymentId");
        const payerId = params.get("PayerID");
        const userId = localStorage.getItem("userId");
        const serviceId = localStorage.getItem("serviceId");
        const axiosInstance = axios.create({});
        axiosInstance.interceptors.request.use(
          (config) => {
            const token = Cookies.get("jwt_token");
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );
        const response = await axiosInstance.get(
          "https://backend-w87n.onrender.com/payment/execute",
          {
            params: {
              paymentId: paymentId,
              payerId: payerId,
              userId: userId,
              serviceId: serviceId,
            },
          }
        );

        if (response.data === "success") {
          localStorage.removeItem("userId");
          localStorage.removeItem("serviceId");
          window.opener.postMessage(
            { status: "success" },
            window.location.origin
          );
          window.close();
        } else {
          window.opener.postMessage(
            { status: "failure" },
            window.location.origin
          );
          window.close();
        }
      } catch (error) {
        console.error("Error executing payment:", error);
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "There was an error processing your payment.",
          showConfirmButton: true,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.opener.postMessage(
              { status: "error" },
              window.location.origin
            );
            window.close();
          }
        });
      }
    };

    executePayment();
  }, [location.search]);

  return (
    <>
      <div id="preloder">
        <div className="loader"></div>
      </div>
    </>
  );
};

export default ExecutePaymentComponent;
