import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../services/reservationService';
import toast from 'react-hot-toast';
import '../assets/styles/reservations.css'; 
import Swal from 'sweetalert2'; 
import paymentService from '../services/paymentService';

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
            toast.success("Payment completed! Your reservation has been confirmed..");
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

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: 'ARE YOU SURE?',
            text: "This action is permanent and cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff4d00',
            cancelButtonColor: '#333',
            confirmButtonText: 'YES, CANCEL IT',
            background: '#151515',
            color: '#fff',
            customClass: {
                popup: 'swal-custom-dark'
            }
        });

        if (result.isConfirmed) {
            try {
                await reservationService.cancelReservation(id);
                toast.success("Reservation cancelled");
                fetchReservations(); 
            } catch (error) {
                toast.error("Could not cancel reservation");
            }
        }
    };

    const handleCheckOut = async (res) => {
        try {
            const loadingToast = toast.loading("Redirecting to Secure Payment...");
            const data = await paymentService.initiatePayment(res.id);
            
            toast.dismiss(loadingToast);

            if (data && data.url) {
                window.location.href = data.url; 
            } else {
                toast.error("Payment URL not found");
            }
        } catch (error) {
            toast.dismiss();
            console.error("Payment Error:", error);
            toast.error("Failed to initialize payment");
        }
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="reservations-container">
            <div className="reservations-header">
                <h2>My Reservations</h2>
                <p>Showing page {currentPage} of {totalPages || 1}</p>
            </div>

            {reservations.length === 0 ? (
                <div className="empty-state">
                    <p>You have no active reservations.</p>
                </div>
            ) : (
                <>
                    <div className="res-grid">
                        {currentBookings.map((res) => (
                            <div key={res.id} className="res-card">
                                <div className="res-info">
                                    <div className="res-main-details">
                                        <h4>{res.vehicleBrand} {res.vehicleName}</h4>
                                        <span className={`status-badge ${res.status.toLowerCase().replace(' ', '_')}`}>
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
                                Previous
                            </button>

                            <span className="page-info">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button 
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyReservationPage;