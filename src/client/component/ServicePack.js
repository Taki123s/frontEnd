import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from './Carousel';
import ServicePackItems from './ServicePackDetail';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import Swal from "sweetalert2";

function ServicePack() {
    useEffect(() => {

        decodeToken();

    }, []);

    const [servicePacks, setServicePacks] = useState([]);
    const [loggedUser, setLoggedUser] = useState(null);
    const decodeToken = () => {
        const token = Cookies.get("jwt_token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setLoggedUser(decodedToken);
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Must Login',
                text: 'You must login.',
                showConfirmButton: true,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'https://animewebnew.netlify.app';
                }
            });
        }
    };
    return (
        <>
            <div id="ah_wrapper">
                <section className="hero">
                    <div className="container">

                        <div><Carousel/></div>
                    </div>
                </section>
                <section className="product spad">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="trending__product">
                                    <div className="row">
                                        <div className="col-lg-8 col-md-8 col-sm-8">
                                            <div className="section-title">
                                                <h4>Các loại gói xem</h4>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                        </div>
                                    </div>
                                    {loggedUser && <ServicePackItems/>}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </>

    );
}

export default ServicePack;