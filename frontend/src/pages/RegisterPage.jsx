import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Creating account...');
        
        try {
            await register(formData);
            
            toast.success('Account created successfully!', { id: loadingToast });
            navigate('/'); 
        } catch (error) {
            const errorCode = error.response?.data?.code;

            if (errorCode === "EMAIL_ALREADY_EXISTS") {
                toast.error("This email is already registered", { id: loadingToast });
            } else if (errorCode === "INVALID_DATES") { 
                toast.error("The provided dates are invalid.", { id: loadingToast });
            } else {
                toast.error(error.response?.data?.message || "Registration failed. Please try again.", { id: loadingToast });
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input name="firstName" value={formData.firstName} type="text" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input name="lastName" value={formData.lastName} type="text" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" value={formData.email} type="email" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" value={formData.password} type="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <Link to="/login" className="auth-link">Already have an account? Login</Link>
            </div>
        </div>
    );
};
export default RegisterPage;