import React, {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';
import {parseISO} from 'date-fns';
import {getUserPackedList, deleteServicePack, deleteUserPacked} from '../../service/ServicePacksService';
import Swal from "sweetalert2";
import {useNavigate} from 'react-router-dom';

export const ListUserPacked = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isNewModalOpen, setNewModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getUserPackedList()
            .then((response) => {
                setServices(response.data);
            })
            .catch((error) => {
                Swal.fire({
                    title: "Lỗi",
                    text: error.response?.data.message || "Unknown error occurred",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
            });
    }, []);

    const handleDelete = (editedService) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
            deleteUserPacked(editedService.id)
                .then((response) => {

                    getUserPackedList()
                        .then((response) => {
                            setServices(response.data);
                        })
                        .catch((error) => {
                            Swal.fire({
                                title: "Lỗi",
                                text: error.response?.data.message || "Unknown error occurred",
                                icon: "error",
                                timer: 2000,
                                showConfirmButton: false,
                              });
                        });
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Lỗi",
                        text: error.response?.data.message || "Unknown error occurred",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                });
            }
        });
    };
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
            id: 5,
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
            id: 6,
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
            id: 8,
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
        {
            id: 9,
            name: 'Option',
            cell: (row) => (
                <div>
                    <Button
                        variant="contained"
                        style={{marginLeft: '20px'}}
                        color="error"
                        onClick={() => handleDelete(row)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const paginationComponentOptions = {
        selectAllRowsItem: true,
        selectAllRowsItemText: 'ALL',
    };

    return (
        <div>
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
