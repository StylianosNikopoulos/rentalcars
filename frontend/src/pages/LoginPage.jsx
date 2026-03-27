import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
            e.preventDefault();
            const loadingToast = toast.loading('Authenticating...');
            
            try {
                await login({ email, password });
                toast.success('Welcome back!', { id: loadingToast });
                navigate('/'); 
            } catch (error) {
                toast.error('Invalid email or password!', { id: loadingToast });
            }
        };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-button">Sign In</button>
                </form>
                <Link to="/register" className="auth-link">Don't have an account? Register here</Link>
            </div>
        </div>
    );
};

export default LoginPage;