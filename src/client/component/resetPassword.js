import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/ResetPassword.css';

function ResetPassword() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp.');
            return;
        }

        axios.post('https://backend-w87n.onrender.com/auth/reset-password', null, {
            params: {
                token,
                newPassword
            }
        })
            .then(response => setSuccess('Đặt lại mật khẩu thành công!'))
            .catch(error => setError('Có lỗi xảy ra. Vui lòng thử lại.'));
    };

    return (
        <div id="ah_wrapper">
            <form onSubmit={handleSubmit} className="reset-password-form">
                <h2>Đặt lại mật khẩu</h2>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                />
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type="submit">Đặt lại mật khẩu</button>
            </form>
        </div>
    );
}

export default ResetPassword;
