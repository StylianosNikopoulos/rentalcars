import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../hooks/useAuth'; 
import toast from 'react-hot-toast';
import '../../assets/styles/navbar.css'; 

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isAdmin = user?.user?.role === 'ADMIN' || user?.role === 'ADMIN';

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
                {user ? (
                    <>
                        <span className="welcome-msg">
                            <i className="far fa-user-circle"></i> {user.user?.firstName || user.user?.email?.split('@')[0] || 'User'}
                        </span>

                        <Link to="/vehicles" onClick={closeMobileMenu}>
                            <i className="fas fa-car-side nav-icon"></i> Vehicles
                        </Link>
                        
                        <Link to="/reservations" onClick={closeMobileMenu}>
                            <i className="far fa-calendar-alt nav-icon"></i> Reservations
                        </Link>
                        
                        <Link to="/profile" onClick={closeMobileMenu}>
                            <i className="far fa-id-badge nav-icon"></i> Profile
                        </Link>

                        {isAdmin && (
                            <Link to="/admin" className="admin-link-highlight" onClick={closeMobileMenu}>
                                <i className="fas fa-user-shield nav-icon"></i> Admin Panel
                            </Link>
                        )}
                        
                        <button onClick={handleLogout} className="logout-btn">
                            Logout<i className="fas fa-sign-out-alt"></i>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/vehicles" onClick={closeMobileMenu}>
                            <i className="fas fa-car-side nav-icon"></i> Vehicles
                        </Link>
                        
                        <Link to="/login" onClick={closeMobileMenu}>
                            Sign In
                        </Link>
                        
                        <Link to="/register" className="register-nav-btn" onClick={closeMobileMenu}>
                            Register <i className="fas fa-user-plus"></i>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;