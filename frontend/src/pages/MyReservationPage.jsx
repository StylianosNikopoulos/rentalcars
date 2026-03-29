import React, { useEffect, useState } from 'react';
import reservationService from '../services/reservationService';
import toast from 'react-hot-toast';
import '../assets/styles/reservations.css'; 
import Swal from 'sweetalert2'; 

const MyReservationPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
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

    const handleCancel = async (id) => {
        const result = await         
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
            });

        if (result.isConfirmed) {
            try {
                await reservationService.cancelReservation(id);
                Swal.fire(
                    'Cancelled!',
                    'Your reservation has been cancelled.',
                    'success'
                );
                fetchReservations(); 
            } catch (error) {
                toast.error("Could not cancel reservation");
            }
        }
    };

    const handleCheckOut = async (id) => {

    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="reservations-container">
            <div className="reservations-header">
                <h2>My Bookings</h2>
                <p>Manage your upcoming and past car rentals</p>
            </div>

            {reservations.length === 0 ? (
                <div className="empty-state">
                    <p>You have no active reservations.</p>
                </div>
            ) : (
                <div className="res-grid">
                {reservations.map((res) => (
                    <div key={res.id} className="res-card">
                        <div className="res-info">
                            <div className="res-main-details">
                                <h4>{res.vehicleBrand} {res.vehicleName}</h4>
                                <span className={`status-badge ${res.status.toLowerCase()}`}>
                                    {res.status.replace('_', ' ')}
                                </span>
                            </div>
                            
                            <p className="res-date">
                                <i className="far fa-calendar-alt"></i> 
                                {res.startDate ? new Date(res.startDate).toLocaleDateString() : 'N/A'} — 
                                {res.endDate ? new Date(res.endDate).toLocaleDateString() : 'N/A'}
                            </p>

                            <p className="res-price">
                                Total Amount: <strong>{res.totalAmount?.toFixed(2)}€</strong>
                            </p>
                        </div>


                        <div className="res-actions">
                            {(res.status !== 'CANCELLED' && res.status !== 'COMPLETED') && (
                                <button 
                                    onClick={() => handleCancel(res.id)}
                                    className="cancel-btn-premium"
                                >
                                    Cancel Booking
                                </button>
                            )}
                            {res.status === 'PENDING' && (
                                <button 
                                    onClick={() => handleCheckOut(res.id)}
                                    className="checkOut-btn-premium"
                                >
                                    Check Out 
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
};
export default MyReservationPage;