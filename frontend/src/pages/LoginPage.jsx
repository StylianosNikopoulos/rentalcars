import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/auth.css';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.type]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Authenticating...');
        try {
            await login(credentials);
            toast.success('Welcome back!', { id: loadingToast });
            navigate('/', { replace: true }); 
        } catch (error) {
            const errorCode = error.response?.data?.code;

            if (errorCode === "INVALID_CREDENTIALS") {
                toast.error("Invalid email or password.", { id: loadingToast });
            } else {
                toast.error(error.response?.data?.message || "Login failed.", { id: loadingToast });
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={credentials.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={credentials.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="auth-button">Sign In</button>
                </form>
                <Link to="/register" className="auth-link">Don't have an account? Register</Link>
            </div>
        </div>
    );
};

export default LoginPage;