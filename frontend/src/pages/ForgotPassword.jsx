import React, { useState } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import '../assets/styles/auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.forgotPassword(email);
            setIsSubmitted(true);
            toast.success("Instructions sent if the account exists.");
        } catch (error) {
            toast.error("Something went wrong. Try again later.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Check your Email</h2>
                    <p>If an account is associated with {email}, you will receive a reset link shortly.</p>
                    <Link to="/login" className="back-link">Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <p>Enter your email to receive a recovery token.</p>
                <div className="form-group">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="confirm-glow-btn">Send Reset Token</button>
                <Link to="/login" className="back-to-login">
                     <span className="arrow">←</span> Back to Login
                </Link>
            </form>
        </div>
    );
};

export default ForgotPassword;