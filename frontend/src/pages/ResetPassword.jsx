import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import '../assets/styles/auth.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            await authService.resetPassword(token, passwords.newPassword);
            toast.success("Password updated!");
            navigate('/');
        } catch (error) {
            const msg = error.response?.data?.message || "Invalid or expired token.";
            toast.error(msg);
        }
    };

    if (!token) return <div>Invalid Reset Link</div>;

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Set New Password</h2>
                <div className="form-group">
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        placeholder="Confirm New Password" 
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        required 
                    />
                </div>
                <button type="submit" className="confirm-glow-btn">Update Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;