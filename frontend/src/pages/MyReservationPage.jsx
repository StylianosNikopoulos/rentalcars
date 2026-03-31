import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../services/reservationService';
import paymentService from '../services/paymentService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; 
import '../assets/styles/reservations.css'; 
import '../assets/styles/swal-custom.css';

const MyReservationPage = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 3;

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("success")) {
            toast.success("Payment completed! Your reservation has been confirmed.");
            fetchReservations(); 
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (query.get("canceled")) {
            toast.error("Payment cancelled.");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const fetchReservations = async () => {
        try {
            const data = await reservationService.getMyReservations();
            setReservations(data);
        } catch (error) {
            toast.error("Failed to load reservations");
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(reservations.length / bookingsPerPage);
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = reservations.slice(indexOfFirstBooking, indexOfLastBooking);

    const handleCancel = (reservationId) => {
        Swal.fire({
            title: 'CANCEL RESERVATION?',
            text: "This action will cancel your booking. Are you sure?",
            icon: 'warning',
            iconColor: '#ff4d00',
            background: '#151515',
            showCancelButton: true,
            confirmButtonText: 'YES, CANCEL IT',
            cancelButtonText: 'NO, KEEP IT',
            target: '.reservations-container', 
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
                const loadingToast = toast.loading("Canceling reservation...");
                try {
                    await reservationService.cancelReservation(reservationId);
                    toast.success("Reservation Canceled Successfully", { id: loadingToast });
                    fetchReservations(); 
                } catch (error) {
                    toast.error("Could not cancel reservation", { id: loadingToast });
                }
            }
        });
    };

    const handleCheckOut = async (res) => {
        const loadingToast = toast.loading("Redirecting to Secure Payment...");
        try {
            const data = await paymentService.initiatePayment(res.id);
            toast.dismiss(loadingToast);
            if (data && data.url) {
                window.location.href = data.url; 
            } else {
                toast.error("Payment URL not found");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to initialize payment");
        }
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="reservations-container">
            <div className="reservations-header">
                <h2>My Reservations</h2>
                <p>Manage your reservations and payments</p>
            </div>

            {reservations.length === 0 ? (
                <div className="empty-state">
                    <p>You have no active reservations.</p>
                    <button onClick={() => navigate('/vehicles')} className="checkOut-btn-premium" style={{width: 'auto', marginTop: '1rem'}}>
                        Browse Fleet
                    </button>
                </div>
            ) : (
                <>
                    <div className="res-grid">
                        {currentBookings.map((res) => (
                            <div key={res.id} className="res-card">
                                <div className="res-info">
                                    <div className="res-main-details">
                                        <h4>{res.vehicleBrand} {res.vehicleName}</h4>
                                        <span className={`status-badge ${res.status.toLowerCase().replace(/\s+/g, '_')}`}>
                                            {res.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    
                                    <p className="res-date">
                                        <i className="far fa-calendar-alt"></i> 
                                        {res.startDate ? new Date(res.startDate).toLocaleDateString() : 'N/A'} — 
                                        {res.endDate ? new Date(res.endDate).toLocaleDateString() : 'N/A'}
                                    </p>

                                    <p className="res-price">
                                        Total: <strong>{res.totalAmount?.toFixed(2)}€</strong>
                                    </p>
                                </div>

                                <div className="res-actions">
                                    {(res.status.toUpperCase() !== 'CANCELLED' && res.status.toUpperCase() !== 'CONFIRMED') && (
                                        <button onClick={() => handleCancel(res.id)} className="cancel-btn-premium">
                                            Cancel
                                        </button>
                                    )}

                                    {res.status.toUpperCase() === 'PENDING' && (
                                        <button onClick={() => handleCheckOut(res)} className="checkOut-btn-premium">
                                            Check Out
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>

                            <span className="page-info">
                                {currentPage} / {totalPages}
                            </span>

                            <button 
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyReservationPage;