import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import '../assets/styles/admin.css';
import vehicleService from '../services/vehicleService';
import userService from '../services/userService';
import reservationService from '../services/reservationService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; 
import '../assets/styles/swal-custom.css';

const AdminPage = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('vehicles');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentVehicleId, setCurrentVehicleId] = useState(null);
    const [plateError, setPlateError] = useState('');
    
    const [vehiclePage, setVehiclePage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [reservationPage, setReservationPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [vehiclePage, userPage, reservationPage]);

    useEffect(() => {
        setVehiclePage(1);
        setUserPage(1);
        setReservationPage(1);
    }, [activeTab]);

    const [newVehicle, setNewVehicle] = useState({
        brand: '',
        model: '',
        dailyPrice: '',
        fuelType: '',
        licensePlate: '',
        year: new Date().getFullYear(),
        images: [] 
    });

    // React Query: Fetching Data ---
    
    const { data: vehicleResponse = {}, isLoading: loadingVehicles } = useQuery({
        queryKey: ['admin-vehicles', vehiclePage],
        queryFn: () => vehicleService.getAllVehicles(vehiclePage - 1, itemsPerPage),
        enabled: activeTab === 'vehicles',
        refetchInterval: 10000,
        staleTime: 0,
        refetchOnMount: true,
        keepPreviousData: true
    });

    const { data: users = [], isLoading: loadingUsers } = useQuery({
        queryKey: ['admin-users'],
        queryFn: () => userService.getAllUsers(),
        enabled: activeTab === 'users',
        refetchInterval: 30000,
        staleTime: 0,
        refetchOnMount: true
    });

    const { data: reservations = [], isLoading: loadingReservations } = useQuery({
        queryKey: ['admin-reservations'],
        queryFn: () => reservationService.getAllReservations(),
        enabled: activeTab === 'reservations',
        refetchInterval: 5000,
        staleTime: 0,
        refetchOnMount: true,
        refetchIntervalInBackground: true
    });

    const currentVehicles = vehicleResponse.content || [];
    const totalVehiclePages = vehicleResponse.page?.totalPages || 1;

    // Users Pagination
    const totalUserPages = Math.ceil(users.length / itemsPerPage);
    const currentUsers = users.slice(
        (userPage - 1) * itemsPerPage,
        userPage * itemsPerPage
    );

    // Reservations Pagination
    const totalReservationPages = Math.ceil(reservations.length / itemsPerPage);
    const currentReservations = reservations.slice(
        (reservationPage - 1) * itemsPerPage,
        reservationPage * itemsPerPage
    );

    // React Query: Mutations ---

    const deleteVehicleMutation = useMutation({
        mutationFn: (id) => vehicleService.deleteVehicle(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-vehicles']);
            toast.success("Vehicle deleted successfully");
            if (currentVehicles.length === 1 && vehiclePage > 1) setVehiclePage(prev => prev - 1);
        },
        onError: () => toast.error("Could not delete vehicle")
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            toast.success("User deleted successfully");
            if (currentUsers.length === 1 && userPage > 1) setUserPage(prev => prev - 1);
        },
        onError: () => toast.error("Error deleting user")
    });

    const cancelResMutation = useMutation({
        mutationFn: (id) => reservationService.cancelReservation(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-reservations']);
            toast.success("Reservation canceled");
        },
        onError: () => toast.error("Error cancelling reservation")
    });

    const returnResMutation = useMutation({
        mutationFn: (id) => reservationService.returnVehicle(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-reservations']);
            toast.success("Vehicle returned successfully!");
        },
        onError: () => toast.error("Error processing return")
    });

    // Handlers

    const handleCancelReservation = (id) => {
        confirmSwal('CANCEL RESERVATION?', "This will cancel the pending reservation.", () => {
            cancelResMutation.mutate(id);
        });
    };

    const handleDeleteUser = (id) => {
        confirmSwal('DELETE USER?', "This action will permanently delete the user.", () => {
            deleteUserMutation.mutate(id);
        });
    };

    const handleDeleteVehicle = (id) => {
        confirmSwal('DELETE VEHICLE?', "This action will delete vehicle. Are you sure?", () => {
            deleteVehicleMutation.mutate(id);
        });
    };

    const handleReturnVehicle = (id) => {
        confirmSwal('RETURN VEHICLE?', "Confirm that the vehicle has been returned and inspected.", () => {
            returnResMutation.mutate(id);
        });
    };

    const confirmSwal = (title, text, onConfirm) => {
        Swal.fire({
            title, text, icon: 'warning', iconColor: '#ff4d00', background: '#151515',
            showCancelButton: true, confirmButtonText: 'YES', cancelButtonText: 'NO',
            buttonsStyling: false,
            customClass: {
                container: 'swal-fix-overlay', popup: 'swal-custom-popup',
                actions: 'swal-custom-actions', confirmButton: 'swal-btn swal-btn-confirm', cancelButton: 'swal-btn swal-btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) onConfirm();
        });
    };

    // Vehicle Management Logic

    const openUpdateModal = (vehicle) => {
        setIsEditMode(true);
        setCurrentVehicleId(vehicle.id);
        const rawImages = vehicle.imageUrls || vehicle.images || [];
        const formattedImages = rawImages.map(item => ({
            url: typeof item === 'object' ? item.url : item,
            isMain: (typeof item === 'object' ? item.url : item) === vehicle.mainImageUrl
        }));
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
                    images: [...prev.images, { url: reader.result, file: file, isMain: prev.images.length === 0 }]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newVehicle.images.length === 0) return toast.error("At least one image is required");

        const loadingToast = toast.loading(isEditMode ? "Processing..." : "Creating vehicle...");
        try {
            const uploadPromises = newVehicle.images.map(async (img) => {
                if (img.url.startsWith('http')) return { url: img.url, isMain: img.isMain };
                const uploadedUrl = await uploadToCloudinary(img.file);
                return { url: uploadedUrl, isMain: img.isMain };
            });

            const uploadedImagesMetadata = await Promise.all(uploadPromises);
            const urlsArray = uploadedImagesMetadata.map(img => img.url);
            const mainImgObj = uploadedImagesMetadata.find(img => img.isMain) || uploadedImagesMetadata[0];

            const payload = {
                brand: newVehicle.brand,
                model: newVehicle.model,
                year: parseInt(newVehicle.year),
                fuelType: newVehicle.fuelType,
                licensePlate: newVehicle.licensePlate,
                dailyPrice: parseFloat(newVehicle.dailyPrice),
                imageUrls: urlsArray,
                mainImageUrl: mainImgObj.url
            };

            if (isEditMode) {
                await vehicleService.updateVehicle(currentVehicleId, payload);
            } else {
                await vehicleService.createVehicle(payload);
            }
            
            toast.success(isEditMode ? "Vehicle updated" : "Vehicle created", { id: loadingToast });
            queryClient.invalidateQueries(['admin-vehicles']);
            closeModal();
        } catch (error) {
            toast.error("Operation failed", { id: loadingToast });
        }
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); 
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST', body: formData
        });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        return data.secure_url;
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
        setPlateError(value && !/^[A-Z]{3}-\d{4}$/.test(value) ? 'Format: ABC-1234' : '');
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
            if (updated.length > 0 && !updated.some(img => img.isMain)) updated[0].isMain = true;
            return { ...prev, images: updated };
        });
    };

    // --- PAGINATION ---
    const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
        if (totalPages <= 1) return null;
        return (
            <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', Grid: 'center', alignItems: 'center', gap: '15px' }}>
                <button 
                    onClick={() => onPageChange(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1} 
                    className="page-btn"
                >
                    <i className="fas fa-chevron-left"></i> PREVIOUS
                </button>
                <span className="page-info" style={{ color: '#aaa', fontSize: '0.9rem' }}>Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages} 
                    className="page-btn"
                >
                    NEXT <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        );
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
                            <button className="add-btn" onClick={() => { closeModal(); setIsModalOpen(true); }}>
                                + Add Vehicle
                            </button>
                            
                            {loadingVehicles ? (
                                <div className="loader-container" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="loader"></div>
                                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '2px', marginTop: '15px' }}>
                                        FETCHING VEHICLES...
                                    </span>
                                </div>
                            ) : (
                                <>
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
                                            {currentVehicles.map(car => (
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
                                    
                                    <PaginationControls 
                                        currentPage={vehiclePage} 
                                        totalPages={totalVehiclePages} 
                                        onPageChange={setVehiclePage} 
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="admin-section">
                            {loadingUsers ? (
                                <div className="loader-container" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="loader"></div>
                                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '2px', marginTop: '15px' }}>
                                        FETCHING USERS...
                                    </span>
                                </div>
                            ) : (
                                <>
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
                                            {currentUsers.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.firstName} {user.lastName}</td>
                                                    <td>{user.email}</td>
                                                    <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
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
                                    
                                    <PaginationControls 
                                        currentPage={userPage} 
                                        totalPages={totalUserPages} 
                                        onPageChange={setUserPage} 
                                    />
                                </>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'reservations' && (
                        <div className="admin-section">
                            {loadingReservations ? (
                                <div className="loader-container" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="loader"></div>
                                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '2px', marginTop: '15px' }}>
                                        FETCHING RESERVATIONS...
                                    </span>
                                </div>
                            ) : (
                                <>
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
                                            {currentReservations.length > 0 ? currentReservations.map(res => (
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

                                                            {res.status === 'ACTIVE' && (
                                                                <button className="status-btn return-btn-table" onClick={() => handleReturnVehicle(res.id)}>
                                                                    <i className="fas fa-undo"></i> Return
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="6" style={{textAlign: 'center', color: '#666', padding: '30px'}}>No reservations found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                    
                                    <PaginationControls 
                                        currentPage={reservationPage} 
                                        totalPages={totalReservationPages} 
                                        onPageChange={setReservationPage} 
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>

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