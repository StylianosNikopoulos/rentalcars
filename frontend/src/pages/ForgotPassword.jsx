import React, { useState } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';
import '../assets/styles/auth.css';

const ForgotPassword = () => {
    const { lang } = useLang();
    const t = translations[lang].forgotPassword;

    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.forgotPassword(email);
            setIsSubmitted(true);
            toast.success(t.toastSuccess);
        } catch (error) {
            toast.error(error.response?.data?.message || t.toastError);
        }
    };

    if (isSubmitted) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>{t.checkEmailTitle}</h2>
                    <p>{t.checkEmailDesc.replace('{{email}}', email)}</p>
                    <Link to="/login" className="back-to-login">
                     <span className="arrow">←</span> {t.backToLogin}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
                <div className="form-group">
                    <input 
                        type="email" 
                        placeholder={t.placeholderEmail} 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="confirm-glow-btn">{t.btnSubmit}</button>
                <Link to="/login" className="back-to-login">
                     <span className="arrow">←</span> {t.backToLogin}
                    </Link>
            </form>
        </div>
    );
};

export default ForgotPassword;