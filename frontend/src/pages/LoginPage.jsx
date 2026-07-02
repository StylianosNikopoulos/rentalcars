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
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
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
                        <label>Email Address</label>
                        <input 
                            name="email"
                            type="email" 
                            value={credentials.email} 
                            onChange={handleChange} 
                            placeholder="name@example.com"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            name="password"
                            type="password" 
                            value={credentials.password} 
                            onChange={handleChange} 
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    <div className="forgot-password-wrapper">
                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>
                    <button type="submit" className="auth-button">
                        Sign In <i className="fas fa-sign-in-alt"></i>
                    </button>
                </form>
                <Link to="/register" className="auth-link">Don't have an account? Register</Link>
            </div>
        </div>
    );
};

export default LoginPage;