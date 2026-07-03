import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../services/reservationService';
import paymentService from '../services/paymentService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import '../assets/styles/reservations.css'; 
import '../assets/styles/swal-custom.css';

const calculateGlobalTimeLeft = (createdAt) => {
    if (!createdAt) return 0;
    let dateStr = createdAt;
    if (typeof createdAt === 'string') {
        if (dateStr.includes('.')) {
            const parts = dateStr.split('.');
            dateStr = parts[0] + '.' + parts[1].substring(0, 3);
        }
        if (!dateStr.endsWith('Z')) dateStr += 'Z';
    }
    const createdDate = new Date(dateStr);
    if (isNaN(createdDate.getTime())) return 0;

    const expirationTime = createdDate.getTime() + (60 * 60 * 1000);
    const now = new Date().getTime();
    const difference = expirationTime - now;
    return difference > 0 ? difference : 0;
};

const ReservationTimer = ({ createdAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(calculateGlobalTimeLeft(createdAt));

    useEffect(() => {
        const timer = setInterval(() => {
            const nextTime = calculateGlobalTimeLeft(createdAt);
            setTimeLeft(nextTime);
            if (nextTime <= 0) {
                clearInterval(timer);
                onExpire();
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [createdAt, onExpire]);

    if (timeLeft <= 0) {
        return <span className="timer-expired"><i className="fas fa-exclamation-circle"></i> Expired</span>;
    }

    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <span className="res-timer">
            <i className="fas fa-history"></i> {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
        </span>
    );
};

const MyReservationPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 3;

    const { data: reservations = [], isLoading } = useQuery({
        queryKey: ['myReservations'],
        queryFn: reservationService.getMyReservations,
        refetchInterval: 10000,
    });

    const cancelMutation = useMutation({
        mutationFn: (id) => reservationService.cancelReservation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myReservations'] });
            toast.success("Reservation Canceled Successfully");
        },
        onError: () => {
            toast.error("Could not cancel reservation");
        }
    });

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("success")) {
            toast.success("Payment completed! Your reservation has been confirmed.");
            queryClient.invalidateQueries({ queryKey: ['myReservations'] });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (query.get("canceled")) {
            toast.error("Payment canceled.");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [queryClient]);

    // Pagination
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
            buttonsStyling: false,
            customClass: {
                container: 'swal-fix-overlay', 
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                actions: 'swal-custom-actions',
                confirmButton: 'swal-btn swal-btn-confirm',
                cancelButton: 'swal-btn swal-btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                cancelMutation.mutate(reservationId);
            }
        });
    };

    const handleCheckOut = async (res) => {
        const loadingToast = toast.loading("Redirecting to Secure Payment...");
        try {
            const data = await paymentService.initiatePayment(res.id);
            toast.dismiss(loadingToast);
            if (data?.url) {
                window.location.href = data.url; 
            } else {
                toast.error("Payment URL not found");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to initialize payment");
        }
    };


    return (
        <div className="reservations-container">
            <div className="reservations-header">
                <h2>My Reservations</h2>
                <p>Manage your rental bookings and active payments</p>
            </div>

            {isLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <span style={{color: '#888', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '2px', marginTop: '15px'}}>FETCHING RESERVATIONS...</span>
                </div>
            ) : reservations.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><i className="fas fa-car-crash"></i></div>
                    <h3>No Bookings Found</h3>
                    <p>You don't have any active or past reservations at the moment.</p>
                    <button onClick={() => navigate('/vehicles')} className="checkOut-btn-premium" style={{width: 'auto', marginTop: '1.5rem'}}>
                        Explore Our Fleet
                    </button>
                </div>
            ) : (
                <>
                    <div className="res-list-container">
                        {currentBookings.map((res) => {
                            const status = res.status.toUpperCase();
                            const isExpired = calculateGlobalTimeLeft(res.createdAt) <= 0;

                            return (
                                <div key={res.id} className="res-card">
                                    <div className="res-meta-section">
                                        <div className="res-vehicle-block">
                                            <i className="fas fa-car car-placeholder-icon"></i>
                                            <div>
                                                <h4>{res.vehicleBrand} <span>{res.vehicleName}</span></h4>
                                            </div>
                                        </div>
                                        
                                        <div className="res-timeline-block">
                                            <div className="timeline-item">
                                                <small>Rental Period</small>
                                                <p>
                                                    <i className="far fa-calendar-alt"></i> 
                                                    {res.period?.start ? new Date(res.period.start).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'}) : 'N/A'} 
                                                    <span className="arrow-sep">→</span>
                                                    {res.period?.end ? new Date(res.period.end).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'}) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="res-status-actions-section">
                                        <div className="res-pricing-status">
                                            <div className="status-badge-wrapper">
                                                <span className={`status-badge ${res.status.toLowerCase().replace(/\s+/g, '_')}`}>
                                                    {res.status.replace('_', ' ')}
                                                </span>
                                                {status === 'PENDING' && (
                                                    <ReservationTimer 
                                                        createdAt={res.createdAt} 
                                                        onExpire={() => queryClient.invalidateQueries({ queryKey: ['myReservations'] })} 
                                                    />
                                                )}
                                            </div>
                                            <div className="res-total-price">
                                                <span>Total Amount</span>
                                                <strong>€{res.totalAmount?.toFixed(2)}</strong>
                                            </div>
                                        </div>

                                        <div className="res-actions">
                                            {status !== 'CANCELED' && status !== 'CONFIRMED' && !isExpired && (
                                                <button 
                                                    onClick={() => handleCancel(res.id)} 
                                                    className="cancel-btn-premium"
                                                    disabled={cancelMutation.isPending}
                                                >
                                                    {cancelMutation.isPending ? 'Processing...' : 'Cancel Booking'}
                                                </button>
                                            )}

                                            {status === 'PENDING' && !isExpired && (
                                                <button onClick={() => handleCheckOut(res)} className="checkOut-btn-premium">
                                                    Proceed to Checkout <i className="fas fa-credit-card"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );})}
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
                            <span className="page-info">{currentPage} / {totalPages}</span>
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