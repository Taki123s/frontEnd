import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import PayPalButton from './PayPal';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; // Ensure correct import

function ServiceDetail(props) {
    const [servicePacks, setServicePacks] = useState([]);
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        fetchServicePacks();
        decodeToken();
    }, []);

    const fetchServicePacks = () => {
        fetch('https://backend-w87n.onrender.com/servicePack')
            .then(response => response.json())
            .then(data => {
                // Sort the data based on service_type
                const sortedData = data.sort((a, b) => {
                    const order = { 'WEEK': 1, 'MONTH': 2, 'YEAR': 3 };
                    return order[a.service_type] - order[b.service_type];
                });
                setServicePacks(sortedData);
            })
            .catch(error => console.error('Error:', error));
    };

    const decodeToken = () => {
        const token = Cookies.get("jwt_token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setLoggedUser(decodedToken);
        }
    };

    return (
        <div className="row">
            {servicePacks.map(servicePack => (
                <div className="col-lg-4 col-md-6 col-sm-6" key={servicePack.id}>
                    <div className="product__item">
                        <div className="product__item__text">
                            <div className="product__item__pic set-bg"
                                 style={{backgroundImage: `url(${servicePack.service_img})`}}>
                            </div>
                            <h3 className="card-title">Type: {servicePack.service_type}</h3>
                            <h5 className="card-text">Price: {servicePack.price} VND</h5>

                            {loggedUser && (
                                <PayPalButton
                                    amount={servicePack.price}
                                    userId={loggedUser.idUser}
                                    serviceId={servicePack.id}
                                />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ServiceDetail;
