import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/profile.css';
import '../assets/styles/swal-custom.css';
import Swal from 'sweetalert2';

const ProfilePage = () => {
    const { user: authData, logout } = useAuth();
    const navigate = useNavigate();
    const [fullUser, setFullUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ 
        firstName: '', 
        lastName: '',
        phoneNumber: '', 
        address: '', 
        driverLicenseNumber: '' 
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = authData?.user?.id;
            if (userId) {
                try {
                    const data = await userService.getUserById(userId);
                    setFullUser(data);
                    setEditData({ 
                        firstName: data.firstName, 
                        lastName: data.lastName,
                        phoneNumber: data.phoneNumber || '',
                        address: data.address || '',
                        driverLicenseNumber: data.driverLicenseNumber || ''
                    });
                } catch (error) {
                    toast.error("Failed to load profile details");
                } finally {
                    setLoading(false);
                }
            }
        };
        if (authData) fetchUserData();
    }, [authData]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updated = await userService.updateUser(fullUser.id, editData);
            setFullUser(updated);
            setIsEditing(false);
            toast.success("Profile updated!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Update failed. Please check your data.";
            const validationErrors = error.response?.data?.errors; 
            
            if (validationErrors) {
                Object.values(validationErrors).forEach(err => toast.error(err));
            } else {
                toast.error(errorMessage);
            }
            
            console.error("Update error details:", error.response?.data);
        }
    };

    const handleDeleteAccount = () => {
            Swal.fire({
                title: 'ARE YOU SURE?',
                text: "This action cannot be undone!",
                icon: 'warning',
                iconColor: '#ff4d00',
                background: '#151515',
                showCancelButton: true,
                confirmButtonText: 'DELETE',
                cancelButtonText: 'CANCEL',
                
                target: '.profile-container', 
                heightAuto: false, 
                
                buttonsStyling: false,
                customClass: {
                    container: 'swal-fix-overlay', 
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-html',
                    actions: 'swal-custom-actions',
                    confirmButton: 'swal-btn swal-btn-confirm',
                    cancelButton: 'swal-btn swal-btn-cancel'
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await userService.deleteUser(fullUser.id);
                        toast.success("Account deleted");
                        logout();
                        navigate('/');
                    } catch (error) {
                        toast.error("Error during deletion");
                    }
                }
            });
        };

    const LICENSE_CATEGORIES = [
        { value: '', label: 'Select Category' },
        { value: 'AM', label: 'AM (Moped)' },
        { value: 'A1', label: 'A1 (Light Motorcycle)' },
        { value: 'A2', label: 'A2 (Medium Motorcycle)' },
        { value: 'A', label: 'A (Full Motorcycle)' },
        { value: 'B', label: 'B (Car)' },
        { value: 'B1', label: 'B1 (Quadricycles)' },
        { value: 'BE', label: 'BE (Car + Trailer)' },
        { value: 'C1', label: 'C1 (Medium Truck)' },
        { value: 'C', label: 'C (Large Truck)' },
        { value: 'D', label: 'D (Bus)' }
    ];

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h1>Member Account</h1>
                <p>Exclusive Access & Identity Settings</p>
            </header>

            <div className="profile-grid">
                <aside className="profile-card">
                    <div className="avatar-circle">
                        {fullUser?.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <h3>{fullUser?.firstName} {fullUser?.lastName}</h3>
                    <span className="role-badge">{fullUser?.role || 'CUSTOMER'}</span>
                    
                    <div style={{ marginTop: '2.5rem' }}>
                        <button 
                            className={isEditing ? "discard-btn" : "confirm-glow-btn"} 
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? "Discard Changes" : "Modify Profile"}
                        </button>
                    </div>
                </aside>

                <main className="info-section">
                    {!isEditing ? (
                        <div className="info-display">
                            <div className="info-group">
                                <label className="info-label">Email Address</label>
                                <span className="info-value">{fullUser?.email}</span>
                            </div>
                            <div className="info-group">
                                <label className="info-label">First Name</label>
                                <span className="info-value">{fullUser?.firstName}</span>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Last Name</label>
                                <span className="info-value">{fullUser?.lastName}</span>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Phone Number</label>
                                <span className="info-value">{fullUser?.phoneNumber || 'Not provided'}</span>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Address</label>
                                <span className="info-value">{fullUser?.address || 'Not provided'}</span>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Driver's License</label>
                                <span className="info-value">{fullUser?.driverLicenseNumber || 'Not provided'}</span>
                            </div>
                        </div>
                    ) : (
                    <form onSubmit={handleUpdate} className="edit-form">
                        <div className="form-group">
                            <label>First Name</label>
                            <input 
                                type="text" 
                                value={editData.firstName}
                                onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input 
                                type="text" 
                                value={editData.lastName}
                                onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input 
                                type="text" 
                                value={editData.phoneNumber}
                                onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input 
                                type="text" 
                                value={editData.address}
                                onChange={(e) => setEditData({...editData, address: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Driver's License Category</label>
                            <select 
                                className="profile-select"
                                value={editData.driverLicenseNumber}
                                onChange={(e) => setEditData({...editData, driverLicenseNumber: e.target.value})}
                            >
                                {LICENSE_CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="confirm-glow-btn">Save Updates</button>
                    </form>
                    )}

                    <section className="danger-zone">
                        <h4>Security & Privacy</h4>
                        {fullUser?.role !== 'ADMIN' ? (
                            <>
                                <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <button className="delete-btn" onClick={handleDeleteAccount}>
                                    Terminate Account
                                </button>
                            </>
                        ) : (
                            <p style={{ color: '#ff4d00', fontSize: '0.85rem', fontWeight: '600' }}>
                                Administrator accounts cannot be self-terminated.
                            </p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;