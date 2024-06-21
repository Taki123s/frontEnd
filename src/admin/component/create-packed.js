
import React, { useState } from 'react';
import { Modal, Box, TextField, Button, MenuItem, InputAdornment } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const serviceTypes = [
    { value: 'WEEK', label: 'Week' },
    { value: 'MONTH', label: 'Month' },
    { value: 'YEAR', label: 'Year' },
];

const NewServiceModal = ({ open, handleClose, handleSave }) => {
    const [serviceType, setServiceType] = useState('');
    const [price, setPrice] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [imagePreview, setImagePreview] = useState( '');
    const handleSubmit = () => {
        const newService = {service_type: serviceType, price: parseFloat(price),file:selectedImage};
        handleSave(newService);
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);

        };

        reader.readAsDataURL(file);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <h2>Create New Service</h2>
                <TextField
                    select
                    label="Service Type"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {serviceTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                    }}
                />
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Upload Image
                    <input
                        type="file"
                        name="service_img"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Button>
                <Box display="flex" justifyContent="space-between" marginTop="20px">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default NewServiceModal;
