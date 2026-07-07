import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../hooks/useAuth'; 
import toast from 'react-hot-toast';
import '../../assets/styles/navbar.css'; 
import { useLang } from "../../context/LangContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); 
    const { lang, toggleLang } = useLang();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isAdmin = user?.user?.role === 'ADMIN' || user?.role === 'ADMIN';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        logout();
        toast.success(lang === 'en' ? 'Logged out successfully' : 'Αποσυνδεθήκατε με επιτυχία');
        navigate('/');
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsLangOpen(false);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
                Rental<span>Car</span>
            </Link>

            <button 
                className="mobile-menu-btn" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation"
            >
                <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
            </button>

            <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>

                <div className="lang-dropdown-container" ref={dropdownRef}>
                    <button className="lang-dropdown-btn" onClick={() => setIsLangOpen(!isLangOpen)}>
                        <i className="fas fa-globe"></i>
                        <span>{lang.toUpperCase()}</span>
                        <i className={`fas fa-chevron-down arrow-icon ${isLangOpen ? 'rotate' : ''}`}></i>
                    </button>
                    
                    {isLangOpen && (
                        <div className="lang-dropdown-menu">
                            <button 
                                className={`lang-dropdown-item ${lang === 'en' ? 'active' : ''}`}
                                onClick={() => { if(lang !== 'en') toggleLang(); setIsLangOpen(false); closeMobileMenu(); }}
                            >
                                EN (English)
                            </button>
                            <button 
                                className={`lang-dropdown-item ${lang === 'gr' ? 'active' : ''}`}
                                onClick={() => { if(lang !== 'gr') toggleLang(); setIsLangOpen(false); closeMobileMenu(); }}
                            >
                                GR (Ελληνικά)
                            </button>
                        </div>
                    )}
                </div>

                {user ? (
                    <>
                        <span className="welcome-msg">
                            <i className="far fa-user-circle"></i> {user.user?.firstName || user.user?.email?.split('@')[0] || 'User'}
                        </span>

                        <Link to="/vehicles" onClick={closeMobileMenu}>
                            <i className="fas fa-car-side nav-icon"></i> {lang === 'en' ? 'Vehicles' : 'Οχηματα'}
                        </Link>
                        
                        <Link to="/reservations" onClick={closeMobileMenu}>
                            <i className="far fa-calendar-alt nav-icon"></i> {lang === 'en' ? 'Reservations' : 'Κρατησεις'}
                        </Link>
                        
                        <Link to="/profile" onClick={closeMobileMenu}>
                            <i className="far fa-id-badge nav-icon"></i> {lang === 'en' ? 'Profile' : 'Προφιλ'}
                        </Link>

                        {isAdmin && (
                            <Link to="/admin" className="admin-link-highlight" onClick={closeMobileMenu}>
                                <i className="far fa-id-badge nav-icon"></i> {lang === 'en' ? 'Admin Panel' : 'Διαχειριση'}
                            </Link>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/vehicles" onClick={closeMobileMenu}>
                            <i className="fas fa-car-side nav-icon"></i> {lang === 'en' ? 'Vehicles' : 'Οχηματα'}
                        </Link>
                        
                        <Link to="/login" onClick={closeMobileMenu}>
                            {lang === 'en' ? 'Sign In' : 'Συνδεση'}
                        </Link>
                        
                        <Link to="/register" className="register-nav-btn" onClick={closeMobileMenu}>
                            {lang === 'en' ? 'Register' : 'Εγγραφη'} <i className="fas fa-user-plus"></i>
                        </Link>
                    </>
                )}

                {user && (
                    <button onClick={handleLogout} className="logout-btn">
                        {lang === 'en' ? 'Logout' : 'Αποσυνδεση'}<i className="fas fa-sign-out-alt"></i>
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;