import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/auth.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (error) {
            alert("Registration failed!");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <Link to="/login" className="auth-link">Already have an account? Login</Link>
            </div>
        </div>
    );
};

export default RegisterPage;