import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/profile.css';
import Swal from 'sweetalert2';

const ProfilePage = () => {
    const { user: authData, logout } = useAuth();
    const navigate = useNavigate();
    const [fullUser, setFullUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ firstName: '', lastName: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = authData?.user?.id;
            if (userId) {
                try {
                    const data = await userService.getUserById(userId);
                    setFullUser(data);
                    setEditData({ firstName: data.firstName, lastName: data.lastName });
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
        
        const updatePayload = {
            firstName: editData.firstName,
            lastName: editData.lastName
        };

        try {
            const updated = await userService.updateUser(fullUser.id, updatePayload);
            
            setFullUser(updated);
            setIsEditing(false); 
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Update error:", error.response?.data);
            toast.error("Failed to update profile. Please check the fields.");
        }
    };

    const handleDeleteAccount = () => {
        Swal.fire({
            title: 'ARE YOU SURE?',
            text: "This action is permanent and cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff4d00',
            cancelButtonColor: '#333',
            confirmButtonText: 'YES, DELETE IT',
            background: '#151515',
            color: '#fff',
            customClass: {
                popup: 'swal-custom-dark'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await userService.deleteUser(fullUser.id);
                    toast.success("Account Deleted");
                    logout();
                    navigate('/');
                } catch (error) {
                    toast.error("Error during deletion");
                }
            }
        });
    };

    if (loading) return <div className="loader">LOADING PROFILE...</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Member Profile</h1>
            </div>

            <div className="profile-grid">
                <div className="profile-card">
                    <div className="avatar-circle">
                        {fullUser?.firstName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <h3>{fullUser?.firstName} {fullUser?.lastName}</h3>
                    <span className="role-badge">{fullUser?.role || 'CUSTOMER'}</span>
                    
                    <div style={{ marginTop: '2rem' }}>
                        <button className="rent-btn-minimal" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Cancel Edit" : "Edit Profile"}
                        </button>
                    </div>
                </div>

                <div className="info-section">
                    {!isEditing ? (
                        <>
                            <div className="info-group">
                                <span className="info-label">Email Address</span>
                                <span className="info-value">{fullUser?.email}</span>
                            </div>
                            <div className="info-group">
                                <span className="info-label">First Name</span>
                                <span className="info-value">{fullUser?.firstName}</span>
                            </div>
                            <div className="info-group">
                                <span className="info-label">Last Name</span>
                                <span className="info-value">{fullUser?.lastName}</span>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleUpdate} className="edit-form">
                            <div className="form-group">
                                <label>First Name</label>
                                <input 
                                    type="text" 
                                    value={editData.firstName}
                                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input 
                                    type="text" 
                                    value={editData.lastName}
                                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="auth-button">Save Changes</button>
                        </form>
                    )}

                    <div className="danger-zone" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #333' }}>
                        <h4 style={{ color: '#ff4d00', marginBottom: '1rem' }}>Danger Zone</h4>
                        <button className="delete-btn" onClick={handleDeleteAccount}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;