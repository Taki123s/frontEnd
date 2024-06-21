import React, {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';
import {parse} from 'date-fns';
import {getServiceList, editServicePack, deleteServicePack, createServicePack} from '../../service/ServicePacksService';
import EditServiceModal from './packed-edit';
import NewServiceModal from './create-packed';
import Swal from "sweetalert2";
import {useNavigate} from 'react-router-dom';

export const ListService = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isNewModalOpen, setNewModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getServiceList()
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

    const handleEdit = (service) => {
        setSelectedService(service);
        setEditModalOpen(true);
    };

    const handleSave = (editedService) => {
        const formData = new FormData();
        formData.append('id', editedService.id);
        formData.append('service_type', editedService.service_type);
        formData.append('price', editedService.price);
        formData.append('file', editedService.file);
        formData.append("createdAt", editedService.createdAt)
        console.log(editedService);

        editServicePack(editedService.id, formData)
            .then((response) => {
                const updatedServices = services.map((service) =>
                    service.id === editedService.id ? editedService : service
                );
                setServices(updatedServices);
                setEditModalOpen(false);
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
    };
    const handleDelete = (editedService) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteServicePack(editedService.id)
                    .then((response) => {
                        const updatedServices = services.filter((service) => service.id !== editedService.id);
                        setServices(updatedServices);
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

    const handleNew = () => {
        setNewModalOpen(true);
    };

    const handleNewService = (newService) => {
        if (newService.service_type === "WEEK" || newService.service_type === "MONTH" || newService.service_type === "YEAR") {
            const formData = new FormData();
            formData.append("service_type", newService.service_type);
            formData.append("price", newService.price);

            formData.append("file", newService.file)
            createServicePack(formData)
                .then((response) => {
                    if (response.data === "") {
                        setNewModalOpen(false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Create Failed',
                            text: 'A similar service pack already exists.',
                            showConfirmButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate('/admin/packed-service')
                            }
                        });
                    } else {
                        setServices([...services, response.data]);
                        setNewModalOpen(false);
                        Swal.fire({
                            icon: 'success',
                            title: 'Create Successful',
                            text: 'Successfully processed.',
                            showConfirmButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate('/admin/packed-service')
                            }
                        });
                    }
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
        } else {
            alert("Invalid service type. Please select week, month or year.");
        }
    };

    const columns = [
        {id: 1, name: 'Id', selector: (row) => row.id, sortable: true, reorder: true},
        {id: 2, name: 'Description', selector: (row) => row.service_type, sortable: true, reorder: true},
        {id: 3, name: 'Price', selector: (row) => `${row.price} VND`, sortable: true, reorder: true},
        {
            id: 4,
            name: 'Create At',
            selector: (row) => row.createdAt,
            sortable: true,
            sortFunction: (a, b) => {
                const dateA = parse(a.createdAt, 'hh:mm:ss a dd/MM/yyyy', new Date());
                const dateB = parse(b.createdAt, 'hh:mm:ss a dd/MM/yyyy', new Date());
                return dateA - dateB;
            },
            reorder: true,
        },
        {
            id: 5,
            name: 'Option',
            cell: (row) => (
                <div>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(row)}>
                        Edit
                    </Button>
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
            <Button variant="contained" color="primary" onClick={handleNew}>
                New Service
            </Button>
            {selectedService && (
                <EditServiceModal
                    open={isEditModalOpen}
                    handleClose={() => setEditModalOpen(false)}
                    service={selectedService}
                    handleSave={handleSave}
                />
            )}
            <NewServiceModal
                open={isNewModalOpen}
                handleClose={() => setNewModalOpen(false)}
                handleSave={handleNewService}
            />
        </div>
    );
};

export default ListService;
