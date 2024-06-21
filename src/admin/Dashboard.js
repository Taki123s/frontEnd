import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons/css/boxicons.min.css";
import ChartMovie from "./ChartMovie";
import CostChart from "./CostChart";
import { API_GET_PATHS } from "./service/Constant";
import axios from "axios";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [data, setData] = useState({
    totalAccount: 0,
    totalMovie: 0,
    totalMoviePurchase: 0,
    blockAccount: 0,
    topPurchasedList: [],
    topPurchasedListYear: [],
    topNotPurchasedList: [],
    profit: 0,
  });
 const token=Cookies.get("jwt_token");

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const formatDate = (date) => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const day = days[date.getDay()];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${day}, ${dd}/${mm}/${yyyy} - ${h} giờ ${m} phút ${s} giây`;
  };

  const FetchCustomer = () => {

    axios
      .get(API_GET_PATHS.GET_LIST_USER_BOUGHT_SERVICEPACK,{
        headers: {
          'Authorization': `Bearer ${token}`
      }
      })
      .then((response) => {
        setData((prevData) => ({
          ...prevData,
          totalAccount: response.data.length,
        }));
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };
  const FetchservicePack = () => {
    axios
      .get(API_GET_PATHS.GET_ALL_SERVICEPACK,{
        headers: {
          'Authorization': `Bearer ${token}`
      }
      })
      .then((response) => {

        setData((prevData) => ({
          ...prevData,
          totalMoviePurchase: response.data.length,
        }));
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };
  const FetchMovie = () => {
    axios
      .get(API_GET_PATHS.GET_ALL_MOVIE,{
        headers: {
          'Authorization': `Bearer ${token}`
      }
      })
      .then((response) => {

        setData((prevData) => ({
          ...prevData,
          totalMovie: response.data.length,
        }));
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  const FetchUserLocked = () => {
    axios
      .get(API_GET_PATHS.GET_LIST_USER_LOCKED,{
        headers: {
          'Authorization': `Bearer ${token}`
      }
      })
      .then((response) => {
        setData((prevData) => ({
          ...prevData,
          blockAccount: response.data.length,
        }));
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };
  const FetchRevenue = () => {
    axios
      .get(API_GET_PATHS.GET_REVENUE,{
        headers: {
          'Authorization': `Bearer ${token}`
      }
      })
      .then((response) => {
        setData((prevData) => ({
          ...prevData,
          profit: response.data,
        }));
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  const FetchTop2ServicePackBoughtByMonth = () => {
    axios
      .get(API_GET_PATHS.GET_TOP2_SERVICE_PACK_BOUGHT_MONTH,{
        headers: {
          'Authorization': `Bearer ${token}`
      }
      })
      .then((response) => {
        setData((prevData) => ({
          ...prevData,
          topPurchasedList: response.data,
        }));
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  const FetchTop2ServicePackBoughtByYear = () => {
    axios
      .get(API_GET_PATHS.GET_TOP2_SERVICE_PACK_BOUGHT_YEAR,{
        headers: {
          'Authorization': `Bearer ${token}`
      }
      })
      .then((response) => {
        setData((prevData) => ({
          ...prevData,
          topPurchasedListYear: response.data,
        }));
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };
  useEffect(() => {
     FetchCustomer();
     FetchservicePack();
      FetchMovie();
     FetchUserLocked();
     FetchTop2ServicePackBoughtByMonth();
     FetchTop2ServicePackBoughtByYear();
     FetchRevenue();
    const interval = setInterval(() => {
      setCurrentDateTime(new Date()); // Cập nhật thời gian hiện tại sau mỗi 1 giây
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app sidebar-mini rtl">
      <div className="wrapper">
     
        <div className="">
          <div className="row">
            <div className="col-md-12">
              <div className="app-title">
                <div id="clock">{formatDate(currentDateTime)}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <LeftPanel data={data} />
            <RightPanel data={data}/>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeftPanel = ({ data }) => {
  return (
    <div className="col-md-12 col-lg-6">
     <div className="row">
        <StatisticsCard
          icon="bxs-user-account"
          title="Tổng khách hàng"
          value={`${data.totalAccount} khách hàng`}
          info="Tổng số khách hàng được quản lý."
        />
         <StatisticsCard
          icon="bxs-data"
          title="Tổng số phim"
          value={`${data.totalMovie} phim`}
          info="Tổng số phim được quản lý."
        />
        <StatisticsCard
          icon="bxs-shopping-bags"
          title="Tổng lượt mua gói"
          value={`${data.totalMoviePurchase} lượt mua`}
          info="Tổng số lượt mua gói."
        />
        <StatisticsCard
          icon="bxs-error-alt"
          title="Tài khoản bị khóa"
          value={`${data.blockAccount} tài khoản`}
          info="Tổng số tài khoản hiện tại đang bị khóa."
        /> 
        <DataTable
          title="Các gói được mua nhiều nhất trong tháng"
          data={data.topPurchasedList}
        />
        <DataTable
          title="Các gói được mua nhiều nhất trong trong năm"
          data={data.topPurchasedListYear}
        />
      </div> 
    </div>
  );
};

const StatisticsCard = ({ icon, title, value, info }) => {
  return (
    <div className="col-md-6">
      <div className={`widget-small ${icon} coloured-icon`}>
        <i className={`icon bx ${icon} fa-3x`}></i>
        <div className="info">
          <h4>{title}</h4>
          <p>
            <b  className="text-dark">{value}</b>
          </p>
          <p className="info-tong text-dark">{info}</p>
        </div>
      </div>
    </div>
  );
};

const DataTable = ({ title, data }) => {
  return (
    <div className="col-md-12">
      <div className="tile">
        <h3 className="tile-title">{title}</h3>
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID Gói</th>
                <th>Tên Gói</th>
                <th>Số lượng</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {data.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>{movie.service_type}</td>

                  <td>{movie.amount}</td>
                  <td>{new Intl.NumberFormat().format(movie.price)} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProfitStatistics = ({ profit }) => {
  return (
    <div className="col-md-9">
      <div className="tile">
        <h3 className="tile-title">Thống kê doanh thu của năm</h3>
         <CostChart />
        <div>
        Tổng doanh thu thu được trong năm :
          <h5>{new Intl.NumberFormat().format(profit)} VND</h5>
        </div>
      </div>
    </div>
  );
};

const RightPanel = ({ data }) => { 
  return (
    <div className="col-md-12 col-lg-6">
     
      <div className="row">
      <div className="col-md-12">
          <ProfitStatistics profit={data.profit} />

          </div>
      </div>
      <div className="row">
        <div className="col-md-9">
          <div className="tile">
            <h4 className="tile-title">
              Top 5 các bộ phim được xem nhiều nhất
            </h4>
            {/* <iframe src="ChartMovie.js" width="100%" height="500" title="Chart Movie"></iframe> */}
            <ChartMovie />
          </div>
       
        </div>
      </div>
    </div>
 
  );
};

export default Dashboard;
