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

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
                Rental<span>Car</span>
            </Link>

            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
            </button>

            <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
                {user ? (
                    <>
                       <span className="welcome-msg">
                           Hello, {user.user?.email?.split('@')[0] || 'User'}
                       </span>
                       <Link to="/reservations" onClick={() => setIsMobileMenuOpen(false)}>Reservations</Link>
                       
                       {isAdmin && (
                           <Link to="/admin" className="admin-link-highlight" onClick={() => setIsMobileMenuOpen(false)}>
                               Admin Panel
                           </Link>
                       )}

                       <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                       <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/vehicles" onClick={() => setIsMobileMenuOpen(false)}>Vehicles</Link>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                        <Link to="/register" className="register-nav-btn" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;