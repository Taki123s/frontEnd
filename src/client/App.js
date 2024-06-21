import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "../App.css";
import "../css/bootstrap.min.css";
import "../css/owl.carousel.min.css";
import "../css/ds/style.css";
import "../css/home.css";
import MovieDetail from "./page/MovieDetail";
import ProductItem from "./page/ProductItem";
import AnimePage from "./component/Index";
import { CategoriesPage } from "./page/Categorie";
import { HeaderPage } from "./component/Header";
// import Footer from "./page/Footer.js"
import ServicePack from "./component/ServicePack";
import MovieWatching from "./page/MovieWatching";
import LoginGoogle from "./component/LoginGoogleSuccess";
import LoginFacebook from "./component/LoginFacebookSuccess";
import PayPal from "./component/PayPal";
import ExecutePaymentComponent from "./component/ExecutePaymentComponent";
import Follow from "./page/Follow";
import History from "./component/history-packed";
import Viewed from "./page/HistoryViews";
import Profile from "./page/ProfilePage";
import ChangePassword from "./page/Changepassword";
import AboutUs from "./component/about_us";
import AboutPayment from "./component/payment_information";
import ForgotPassword from "./component/forgotPassword";
import ResetPassword from "./component/resetPassword";
import { NotAuthorized } from "./component/NotAuthorized";
function IndexApp() {
  return (
    <Router>
      <HeaderPage />
      <Routes>
        <Route path="/NotAuthorized" element={<NotAuthorized />} />
        <Route path="/" element={<AnimePage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/item" element={<ProductItem />} />
        <Route path="/history-packed" element={<History />} />
        <Route path="/viewed-movies" element={<Viewed />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/about-payment" element={<AboutPayment />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/categories/:idGenre/:nameGenre"
          element={<CategoriesPage />}
        />
        <Route path="/index" element={<AnimePage />} />
        <Route path="/servicePack" element={<ServicePack />} />
        <Route path="/login-google" element={<LoginGoogle />} />
        <Route path="/login-facebook" element={<LoginFacebook />} />
        <Route path="/execute-payment" element={<ExecutePaymentComponent />} />
        <Route
          path="/movie/watching/:movieId/:ordinal"
          element={<MovieWatching />}
        />
        <Route path="/follow_page" element={<Follow />} />
        <Route path="/PayPal" element={<PayPal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/changePassword" element={<ChangePassword />} />
      </Routes>
      {/*<Footer/>*/}

    </Router>
  );
}

export default IndexApp;
