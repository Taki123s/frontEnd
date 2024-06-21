import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useNavigate  } from 'react-router-dom';
const Login = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [genreList, setGenreList] = useState([]);
    const navigate  = useNavigate();
    const [loggedUser, setLoggedUser] = useState(null);
    const [activeTab, setActiveTab] = useState("login");
    const [token, setToken] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [regiserUser,setRegisterUser] = useState(null)
    useEffect(() => {

        try {
            console.log('handleAfterLogin called');
            // Gọi một phương thức khác sau khi đăng nhập thành công
            axios.get('https://backend-w87n.onrender.com/login/facebook', { withCredentials: true })
                .then((response) => {
                    console.log('Response after login:', response.data);
                    const token = response.data.accessToken;
                    setToken(token);
                    const decodedToken = jwtDecode(token);
                    const expires = new Date(decodedToken.exp * 1000);
                    Cookies.set("jwt_token", token, {
                        expires: expires,
                    });
                    decodeToken();



                    if (response.status === 200) {


                        Swal.fire({
                            icon: 'success',
                            title: 'Login Successful',
                            text: `Success`,
                            showConfirmButton: true,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = "https://animewebnew.netlify.app"
                            }
                        });
                    } else {
                        console.error('Error after login:', response.data);
                    }
                });
        } catch (error) {
            console.error('Error after login:', error);
        }
    }, []);
    const decodeToken = () => {
        const token = Cookies.get("jwt_token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setToken(token);
            setLoggedUser(decodedToken);
        }
    };

    return null; // Không có giao diện được render trong component này
};

export default Login;
