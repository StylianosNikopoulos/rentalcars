import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../hooks/useAuth'; 
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); 

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">RentalCar</Link>
            <div className="nav-links">
                {user ? (
                    <>
                       <span className="welcome-msg">
                           Welcome, {user.user?.email?.split('@')[0] || 'User'}
                       </span>
                       <Link to="/profile">Reservations</Link>
                       <Link to="/vehicles">Vehicles</Link>
                       <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;