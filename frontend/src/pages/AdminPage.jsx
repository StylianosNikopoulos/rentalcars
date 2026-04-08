import React, { useState, useEffect } from 'react';
import '../assets/styles/admin.css';
import vehicleService from '../services/vehicleService';
import userService from '../services/userService';
import reservationService from '../services/reservationService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; 
import '../assets/styles/swal-custom.css';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('vehicles');
    const [vehicles, setVehicles] = useState([]);
    const [users, setUsers] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentVehicleId, setCurrentVehicleId] = useState(null);
    const [plateError, setPlateError] = useState('');
    
    const [newVehicle, setNewVehicle] = useState({
        brand: '',
        model: '',
        dailyPrice: '',
        fuelType: '',
        licensePlate: '',
        year: new Date().getFullYear(),
        images: [] 
    });

    useEffect(() => {
        if (activeTab === 'vehicles') loadVehicles();
        else if (activeTab === 'users') loadUsers();
        else if (activeTab === 'reservations') loadReservations();
    }, [activeTab]);

    // --- Load Data Functions ---
    const loadVehicles = async () => {
        setLoading(true);
        try {
            const data = await vehicleService.getAllVehicles();
            setVehicles(data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const loadReservations = async () => {
        setLoading(true);
        try {
            const data = await reservationService.getAllReservations();
            setReservations(data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    // --- Reservation Actions ---
    const handleCancelReservation = async (id) => {
        Swal.fire({
            title: 'CANCEL RESERVATION?',
            text: "This will cancel the pending reservation. Are you sure?",
            icon: 'warning',
            iconColor: '#ff4d00',
            background: '#151515',
            showCancelButton: true,
            confirmButtonText: 'YES, CANCEL IT',
            cancelButtonText: 'NO, KEEP IT',
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
                const loadingToast = toast.loading("Cancelling reservation...");
                try {
                    await reservationService.cancelReservation(id);
                    toast.success("Reservation cancelled", { id: loadingToast });
                    loadReservations();
                } catch (error) {
                    toast.error("Error cancelling reservation", { id: loadingToast });
                }
            }
        });
    };

    // --- User Actions ---
    const handleDeleteUser = async (id) => {
        Swal.fire({
            title: 'DELETE USER?',
            text: "This action will permanently delete the user. Are you sure?",
            icon: 'warning',
            iconColor: '#ff4d00',
            background: '#151515',
            showCancelButton: true,
            confirmButtonText: 'YES, DELETE',
            cancelButtonText: 'CANCEL',
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
                const loadingToast = toast.loading("Deleting user...");
                try {
                    await userService.deleteUser(id);
                    toast.success("User deleted successfully", { id: loadingToast });
                    loadUsers();
                } catch (error) {
                    toast.error("Error deleting user", { id: loadingToast });
                }
            }
        });
    };

    // --- Vehicle Actions ---
    const handleDeleteVehicle = async (id) => {
        Swal.fire({
            title: 'DELETE VEHICLE?',
            text: "This action will delete vehicle. Are you sure?",
            icon: 'warning',
            iconColor: '#ff4d00',
            background: '#151515',
            showCancelButton: true,
            confirmButtonText: 'YES, DELETE IT',
            cancelButtonText: 'NO, KEEP IT',
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
                const loadingToast = toast.loading("Deleting vehicle...");
                try {
                    await vehicleService.deleteVehicle(id);
                    toast.success("Vehicle deleted Successfully", { id: loadingToast });
                    loadVehicles(); 
                } catch (error) {
                    toast.error("Could not delete vehicle", { id: loadingToast });
                }
            }
        });
    };

    const openUpdateModal = (vehicle) => {
        setIsEditMode(true);
        setCurrentVehicleId(vehicle.id);

        const rawImages = vehicle.imageUrls || vehicle.images || [];
        const formattedImages = rawImages.map(item => {
            if (typeof item === 'object') {
                return {
                    url: item.url,
                    isMain: item.main || item.url === vehicle.mainImageUrl
                };
            }
            return {
                url: item,
                isMain: item === vehicle.mainImageUrl
            };
        });

        setNewVehicle({
            brand: vehicle.brand || '',
            model: vehicle.model || '',
            dailyPrice: vehicle.dailyPrice || '',
            fuelType: vehicle.fuelType || '',
            licensePlate: vehicle.licensePlate || '',
            year: vehicle.year || new Date().getFullYear(),
            images: formattedImages
        });

        setIsModalOpen(true);
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewVehicle(prev => ({
                    ...prev,
                    images: [...prev.images, { 
                        url: reader.result, 
                        isMain: prev.images.length === 0 
                    }]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const setMainImage = (index) => {
        setNewVehicle(prev => ({
            ...prev,
            images: prev.images.map((img, i) => ({ ...img, isMain: i === index }))
        }));
    };

    const removeImage = (index) => {
        setNewVehicle(prev => {
            const updated = prev.images.filter((_, i) => i !== index);
            if (updated.length > 0 && !updated.some(img => img.isMain)) {
                updated[0].isMain = true;
            }
            return { ...prev, images: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const urlsArray = newVehicle.images.map(img => img.url);
        const mainImgObj = newVehicle.images.find(img => img.isMain);
        const mainUrlString = mainImgObj ? mainImgObj.url : (urlsArray[0] || "");

        const payload = {
            brand: newVehicle.brand,
            model: newVehicle.model,
            year: parseInt(newVehicle.year),
            fuelType: newVehicle.fuelType,
            licensePlate: newVehicle.licensePlate,
            dailyPrice: parseFloat(newVehicle.dailyPrice),
            imageUrls: urlsArray,
            mainImageUrl: mainUrlString
        };

        if (urlsArray.length === 0) {
            toast.error("At least one image is required");
            return;
        }

        const loadingToast = toast.loading(isEditMode ? "Updating vehicle..." : "Creating vehicle...");

        try {
            if (isEditMode) {
                await vehicleService.updateVehicle(currentVehicleId, payload);
            } else {
                await vehicleService.createVehicle(payload);
            }
            
            toast.success(isEditMode ? "Vehicle updated" : "Vehicle created", { id: loadingToast });
            loadVehicles();
            closeModal();
        } catch (error) {
            console.error("FULL ERROR:", error.response?.data);
            const serverMsg = error.response?.data?.message || "Error saving vehicle";
            toast.error(serverMsg, { id: loadingToast });
        }
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentVehicleId(null);
        setNewVehicle({ brand: '', model: '', dailyPrice: '', fuelType: '', licensePlate: '', year: 2024, images: [] });
    };

    const handlePlateChange = (e) => {
        const value = e.target.value.toUpperCase();
        setNewVehicle({...newVehicle, licensePlate: value});
        const plateRegex = /^[A-Z]{3}-\d{4}$/;
        setPlateError(value && !plateRegex.test(value) ? 'Format: ABC-1234' : '');
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-header"><i className="fas fa-user-shield"></i><span>Admin Panel</span></div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'vehicles' ? 'active' : ''} onClick={() => setActiveTab('vehicles')}><i className="fas fa-car"></i> Vehicles</button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}><i className="fas fa-users"></i> Users</button>
                    <button className={activeTab === 'reservations' ? 'active' : ''} onClick={() => setActiveTab('reservations')}><i className="fas fa-calendar-check"></i> Reservations</button>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <h2>{activeTab.toUpperCase()}</h2>
                </header>

                <div className="admin-content">
                    {activeTab === 'vehicles' && (
                        <div className="admin-section">
                            <button className="add-btn" onClick={() => {
                                setIsEditMode(false);
                                setCurrentVehicleId(null);
                                setNewVehicle({ brand: '', model: '', dailyPrice: '', fuelType: '', licensePlate: '', year: 2024, images: [] });
                                setIsModalOpen(true);
                            }}>
                                + Add Vehicle
                            </button>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Vehicle</th>
                                        <th>Plate</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map(car => (
                                        <tr key={car.id}>
                                            <td><strong>{car.brand}</strong> {car.model}</td>
                                            <td>{car.licensePlate}</td>
                                            <td>€{car.dailyPrice}</td>
                                            <td className="actions-cell">
                                                <button className="btn-update" onClick={() => openUpdateModal(car)}>
                                                    <i className="fas fa-edit"></i> Update
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDeleteVehicle(car.id)}>
                                                    <i className="fas fa-trash"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="admin-section">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.firstName} {user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${user.role.toLowerCase()}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    {user.role !== 'ADMIN' && (
                                                        <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>
                                                            <i className="fas fa-trash"></i> Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {activeTab === 'reservations' && (
                            <div className="admin-section">
                                {loading ? <p>Loading reservations...</p> : (
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>User Email</th>
                                                <th>Vehicle</th>
                                                <th>From</th>
                                                <th>Until</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reservations.length > 0 ? reservations.map(res => (
                                                <tr key={res.id}>
                                                    <td>{res.email}</td>
                                                    <td>{res.vehicleBrand} {res.vehicleName}</td>
                                                    <td>{new Date(res.period.start).toLocaleDateString()}</td>
                                                    <td>{new Date(res.period.end).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`status-badge status-${res.status.toLowerCase()}`}>
                                                            {res.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="actions-cell">
                                                            {res.status === 'PENDING' && (
                                                                <button className="status-btn pick-up" onClick={() => handleCancelReservation(res.id)}>
                                                                    <i className="fas fa-times"></i> Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="6" style={{textAlign: 'center'}}>No reservations found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                </div>
            </main>

            {/* MODAL CREATE & UPDATE */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="admin-modal glass-morphism">
                        <h3>{isEditMode ? 'Update Vehicle' : 'Add New Vehicle'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <input type="text" placeholder="Brand" required value={newVehicle.brand} onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})} />
                                <input type="text" placeholder="Model" required value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
                            </div>

                            <div className="image-grid-upload">
                                {newVehicle.images.map((img, index) => (
                                    <div key={index} className={`image-preview-item ${img.isMain ? 'main-photo' : ''}`}>
                                        <img src={img.url} alt="preview" />
                                        <div className="image-controls">
                                            <button type="button" onClick={() => setMainImage(index)} title="Set as Main"><i className={img.isMain ? "fas fa-star" : "far fa-star"}></i></button>
                                            <button type="button" onClick={() => removeImage(index)} title="Remove Image"><i className="fas fa-times"></i></button>
                                        </div>
                                        {img.isMain && <span className="main-label">MAIN</span>}
                                    </div>
                                ))}
                                <label className="add-more-photos"><i className="fas fa-plus"></i><input type="file" multiple accept="image/*" onChange={handleImagesChange} hidden /></label>
                            </div>

                            <div className="admin-form-group mt-20">
                                <input type="number" step="0.01" className="no-spinners" placeholder="Price/Day" required value={newVehicle.dailyPrice} onChange={e => setNewVehicle({...newVehicle, dailyPrice: e.target.value})} />
                                <div className="flex-1">
                                    <input type="text" placeholder="Plate (ABC-1234)" className={plateError ? 'input-error' : ''} required value={newVehicle.licensePlate} onChange={handlePlateChange} />
                                    {plateError && <span className="error-text">{plateError}</span>}
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <input type="number" placeholder="Year" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} />
                                <div className="select-wrapper">
                                    <select className="admin-select" required value={newVehicle.fuelType} onChange={e => setNewVehicle({...newVehicle, fuelType: e.target.value})}>
                                        <option value="" disabled>Fuel Type</option>
                                        <option value="PETROL">PETROL</option>
                                        <option value="DIESEL">DIESEL</option>
                                        <option value="ELECTRIC">ELECTRIC</option>
                                        <option value="HYBRID">HYBRID</option>
                                    </select>
                                    <i className="fas fa-chevron-down select-icon"></i>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="add-btn">{isEditMode ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;