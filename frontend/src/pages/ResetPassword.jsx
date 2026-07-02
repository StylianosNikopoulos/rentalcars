import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import '../assets/styles/auth.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        const loadingToast = toast.loading('Updating password...');
        try {
            await authService.resetPassword(token, passwords.newPassword);
            toast.success("Password updated successfully!", { id: loadingToast });
            navigate('/login', { replace: true });
        } catch (error) {
            const msg = error.response?.data?.message || "Invalid or expired token.";
            toast.error(msg, { id: loadingToast });
        }
    };

    if (!token) {
        return (
            <div className="auth-container">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '2.5rem', color: '#ff4444', marginBottom: '1.5rem' }}></i>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Invalid Link</h2>
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                        The password reset token is missing or has expired. Please request a new password reset link.
                    </p>
                    <Link to="/login" className="back-to-login" style={{ marginTop: 0 }}>
                        <span className="arrow">←</span> Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Set New Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input 
                            name="newPassword"
                            type="password" 
                            value={passwords.newPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input 
                            name="confirmPassword"
                            type="password" 
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="auth-button" style={{ marginTop: '2rem' }}>
                        Update Password <i className="fas fa-key"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;