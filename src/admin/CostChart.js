import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Ensure you have chart.js installed
import { API_GET_PATHS } from "./service/Constant";
import Cookies from "js-cookie";

const CostChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const token=Cookies.get("jwt_token");

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (từ 0 đến 11, nên +1 để thành 1 đến 12)
    const promises = [];

    for (let month = 1; month <= currentMonth; month++) {
      promises.push(
        axios.get(API_GET_PATHS.GET_USERSERVICE_BY_MONTH+`/${month}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    }

    Promise.all(promises)
      .then((responses) => {
        const labels = [];
        const datasetData = [];

        responses.forEach((response, index) => {
          labels.push(`Month ${index + 1}`);
          datasetData.push(response.data); // Assuming response.data.amount is the data you need
        });

        const sampleData = {
          labels: labels,
          datasets: [
            {
              label: "User Service pack Data",
              data: datasetData,
              fill: false,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
            },
          ],
        };

        setChartData(sampleData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);
  return (
    <div>
      <h2>Cost Chart</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default CostChart;
