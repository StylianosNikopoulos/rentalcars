import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../services/reservationService';
import paymentService from '../services/paymentService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';
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
    const { lang } = useLang();
    const t = translations[lang].myReservations;
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
        return <span className="timer-expired"><i className="fas fa-exclamation-circle"></i> {t.timerExpired}</span>;
    }

    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <span className="res-timer">
            <i className="fas fa-history"></i> {minutes}{t.timerMin} {seconds < 10 ? `0${seconds}` : seconds}{t.timerSec}
        </span>
    );
};

const MyReservationPage = () => {
    const { lang } = useLang();
    const t = translations[lang].myReservations;

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [isActionPending, setIsActionPending] = useState(false);
    const bookingsPerPage = 3;

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage]);

    const { data: reservationResponse = {}, isLoading } = useQuery({
        queryKey: ['myReservations', currentPage],
        queryFn: () => reservationService.getMyReservations(currentPage - 1, bookingsPerPage),
        refetchInterval: 10000,
        keepPreviousData: true,
        enabled: !isActionPending
    });

    const currentBookings = reservationResponse.content || [];
    const totalPages = reservationResponse.page?.totalPages || 1;
    const isTotalElementsZero = reservationResponse.page?.totalElements === 0;

    const cancelMutation = useMutation({
        mutationFn: (id) => reservationService.cancelReservation(id),
        onMutate: () => {
            setIsActionPending(true);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myReservations'] });
            toast.success(t.toastCancelSuccess);
            if (currentBookings.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        },
        onError: () => {
            toast.error(t.toastCancelError);
        },
        onSettled: () => {
            setIsActionPending(false);
        }
    });

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("success")) {
            toast.success(t.toastPaymentSuccess);
            queryClient.invalidateQueries({ queryKey: ['myReservations'] });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (query.get("canceled")) {
            toast.error(t.toastPaymentCanceled);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [queryClient, t]);

    const handleCancel = (reservationId) => {
        if (isActionPending) return;

        Swal.fire({
            title: t.swalCancelTitle,
            text: t.swalCancelText,
            icon: 'warning',
            iconColor: '#ff4d00',
            background: '#151515',
            showCancelButton: true,
            confirmButtonText: t.swalYes,
            cancelButtonText: t.swalNo,
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
        if (isActionPending) return;

        setIsActionPending(true);
        const loadingToast = toast.loading(t.toastRedirecting);
        try {
            const data = await paymentService.initiatePayment(res.id);
            toast.dismiss(loadingToast);
            if (data?.url) {
                window.location.href = data.url; 
            } else {
                setIsActionPending(false);
                toast.error(t.toastPaymentUrlError);
            }
        } catch (error) {
            setIsActionPending(false);
            toast.dismiss(loadingToast);
            toast.error(error.response?.data?.message || t.toastPaymentInitError);
        }
    };

    return (
        <div className="reservations-container">
            <div className="reservations-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
            </div>

            {isLoading && !isActionPending ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <span style={{color: '#888', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '2px', marginTop: '15px'}}>{t.fetching}</span>
                </div>
            ) : isTotalElementsZero ? (
                <div className="empty-state">
                    <div className="empty-icon"><i className="fas fa-car-crash"></i></div>
                    <h3>{t.noBookingsTitle}</h3>
                    <p>{t.noBookingsDesc}</p>
                    <button 
                        onClick={() => navigate('/vehicles')} 
                        className="checkOut-btn-premium" 
                        style={{width: 'auto', marginTop: '1.5rem'}}
                        disabled={isActionPending}
                    >
                        {t.btnExplore}
                    </button>
                </div>
            ) : (
                <>
                    <div className="res-list-container">
                        {currentBookings.map((res) => {
                            const status = res.status.toUpperCase();
                            const isExpired = calculateGlobalTimeLeft(res.createdAt) <= 0;
                            const currentLocale = lang === 'gr' ? 'el-GR' : 'en-GB';

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
                                                <small>{t.rentalPeriod}</small>
                                                <p>
                                                    <i className="far fa-calendar-alt"></i> 
                                                    {res.period?.start ? new Date(res.period.start).toLocaleDateString(currentLocale, {day:'2-digit', month:'short', year:'numeric'}) : 'N/A'} 
                                                    <span className="arrow-sep">→</span>
                                                    {res.period?.end ? new Date(res.period.end).toLocaleDateString(currentLocale, {day:'2-digit', month:'short', year:'numeric'}) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="res-status-actions-section">
                                        <div className="res-pricing-status">
                                            <div className="status-badge-wrapper">
                                                <span className={`status-badge ${res.status.toLowerCase().replace(/\s+/g, '_')}`}>
                                                    {lang === 'gr' && t[res.status.toLowerCase()] ? t[res.status.toLowerCase()] : res.status.replace('_', ' ')}
                                                </span>
                                                {status === 'PENDING' && (
                                                    <ReservationTimer 
                                                        createdAt={res.createdAt} 
                                                        onExpire={() => queryClient.invalidateQueries({ queryKey: ['myReservations'] })} 
                                                    />
                                                )}
                                            </div>
                                            <div className="res-total-price">
                                                <span>{t.totalAmount}</span>
                                                <strong>€{res.totalAmount?.toFixed(2)}</strong>
                                            </div>
                                        </div>

                                        <div className="res-actions">
                                            {status !== 'CANCELED' && status !== 'CONFIRMED' && !isExpired && (
                                                <button 
                                                    onClick={() => handleCancel(res.id)} 
                                                    className="cancel-btn-premium"
                                                    disabled={isActionPending}
                                                >
                                                    {cancelMutation.isPending ? t.btnProcessing : t.btnCancel}
                                                </button>
                                            )}

                                            {status === 'PENDING' && !isExpired && (
                                                <button 
                                                    onClick={() => handleCheckOut(res)} 
                                                    className="checkOut-btn-premium"
                                                    disabled={isActionPending}
                                                >
                                                    {t.btnCheckout} <i className="fas fa-credit-card"></i>
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
                                disabled={currentPage === 1 || isActionPending}
                            >
                                <i className="fas fa-chevron-left"></i> {t.btnPrevious}
                            </button>
                            <span className="page-info">{currentPage} / {totalPages}</span>
                            <button 
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || isActionPending}
                            >
                                {t.btnNext} <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyReservationPage;