import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../hooks/useAuth'; 
import toast from 'react-hot-toast';
import '../../assets/styles/navbar.css'; 

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
                Rental<span>Car</span>
            </Link>

            <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
            </button>

            <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
                {user ? (
                    <>
                       <span className="welcome-msg">
                           Welcome, {user.user?.email?.split('@')[0] || 'Member'}
                       </span>
                       <Link to="/vehicles" onClick={() => setIsMobileMenuOpen(false)}>Vehicles</Link>
                       <Link to="/reservations" onClick={() => setIsMobileMenuOpen(false)}>My Reservations</Link>
                       <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                       <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="register-nav-btn">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;