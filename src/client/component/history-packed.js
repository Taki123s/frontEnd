import React, {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import ArrowDownward from '@mui/icons-material/ArrowDownward';

import "../../css/moviedetail.css";

import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Fix: Removed extra curly braces


import {parseISO} from 'date-fns';
import {
    getUserPackedList,
    deleteServicePack,
    deleteUserPacked,
    getUserPackedListByUser
} from '../../service/ServicePacksService';
import Swal from "sweetalert2";
import {useNavigate} from 'react-router-dom';

import "react-confirm-alert/src/react-confirm-alert.css";


export const ListUserPacked = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get('jwt_token');
    const user = token ? jwtDecode(token) : null;



    useEffect(() => {
        if (user && user.idUser) {
            getUserPackedListByUser(user.idUser)
                .then((response) => {
                    console.log(response.data)
                    setServices(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error("User ID is missing");
        }
    }, []);


    const columns = [
        {id: 1, name: 'Id', selector: (row) => row.id, sortable: true, reorder: true},
        {
            id: 2,
            name: 'User Name',
            selector: (row) => <strong>{row.userId.userName}</strong>,
            sortable: true,
            reorder: true
        },
        {
            id: 3,
            name: 'Full Name',
            selector: (row) => <strong>{row.userId.fullName}</strong>,
            sortable: true,
            reorder: true
        },
        {
            id: 4, name: 'Service Pack', selector: (row) => <strong>{row.servicePackId.service_type}
            </strong>, sortable: true, reorder: true
        },
        {
            id: 5, name: 'Price', selector: (row) => <strong>{row.servicePackId.price} VND
            </strong>, sortable: true, reorder: true
        },
        {
            id: 6,
            name: 'Create At',
            selector: (row) => <strong>{row.createdAt}</strong>,
            sortable: true,
            sortFunction: (a, b) => {
                const dateA = parseISO(a.createdAt);
                const dateB = parseISO(b.createdAt);
                return dateA - dateB;
            },
            reorder: true,
        },
        {
            id:7,
            name: 'Expired Time',
            selector: (row) => <strong>{row.expiredTime}</strong>,
            sortable: true,
            cell: (row) => (
                <div
                    style={{
                        backgroundColor: parseISO(row.expiredTime) > new Date() ? 'springgreen' : 'lightcoral',
                        color: 'black',
                        padding: '5px',
                        borderRadius: '5px',
                    }}
                >
                    <strong>{row.expiredTime}</strong>
                </div>
            ),
            sortFunction: (a, b) => {
                const dateA = parseISO(a.expiredTime);
                const dateB = parseISO(b.expiredTime);
                return dateA - dateB;
            },
            reorder: true,
        },
        {
            id: 7,
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
            reorder: true,
            cell: (row) => (
                <div>
                    <strong> {row.status ? (
                        <span style={{
                            color: 'green'

                        }}>Đang hoạt động</span>
                    ) : (
                        <span style={{color: 'red'}}>Không hoạt động</span>
                    )}
                    </strong>
                </div>
            ),
        },

    ];

    const paginationComponentOptions = {
        selectAllRowsItem: true,
        selectAllRowsItemText: 'ALL',
    };

    return (
        <div id="ah_wrapper">
            <DataTable
                title="Services"
                columns={columns}
                data={services}
                defaultSortFieldId={1}
                sortIcon={<ArrowDownward/>}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                selectableRows
            />
        </div>
    );
};

export default ListUserPacked;
