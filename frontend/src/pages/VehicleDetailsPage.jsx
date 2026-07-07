import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import vehicleService from '../services/vehicleService';
import reservationService from '../services/reservationService';
import toast from 'react-hot-toast';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';
import '../assets/styles/details.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const VehicleDetailsPage = () => {
    const { lang } = useLang();
    const t = translations[lang].details;

    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const { data: vehicle, isLoading: vehicleLoading } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => vehicleService.getVehicleById(id),
    });

    const { data: bookedDates = [], isLoading: datesLoading } = useQuery({
        queryKey: ['vehicle-reservations', id],
        queryFn: async () => {
            const data = await reservationService.getVehicleReservations(id);
            const safeReservations = Array.isArray(data) ? data : [];
            return safeReservations.map(res => {
                if (res.period?.start && res.period?.end) {
                    const dStart = new Date(res.period.start);
                    const dEnd = new Date(res.period.end);
                    dStart.setHours(0, 0, 0, 0);
                    dEnd.setHours(23, 59, 59, 999); 
                    return { start: dStart, end: dEnd };
                }
                return null;
            }).filter(Boolean);
        },
        refetchInterval: 10000
    });

    const bookingMutation = useMutation({
        mutationFn: (bookingData) => reservationService.createReservation(bookingData),
        onSuccess: () => {
            toast.success(t.toastBookingSuccess);
            queryClient.invalidateQueries(['vehicle-reservations', id]);
            setTimeout(() => navigate('/reservations'), 1500);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || t.toastBookingError);
        }
    });

    const handleBooking = async (e) => {
        e.preventDefault(); 
        if (bookingMutation.isPending) return;
        if (!user) {
            toast.error(t.toastLoginReq);
            navigate('/login');
            return;
        }
        if (!acceptedTerms) {
            toast.error(t.toastTermsReq);
            return;
        }
        if (!startDate || !endDate) {
            toast.error(t.toastDatesReq);
            return;
        }

        const formatForBackend = (date) => {
            if (!date) return null;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}T10:00:00`;
        };

        const bookingData = {
            vehicleId: id,
            startDate: formatForBackend(startDate),
            endDate: formatForBackend(endDate)
        };

        bookingMutation.mutate(bookingData);
    };

    if (vehicleLoading || datesLoading) {
        return (
            <div className="loader-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a' }}>
                <div className="loader"></div>
                <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '2px', marginTop: '15px' }}>
                    {t.fetching}
                </span>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="error-message" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ff4d4d', padding: '2rem', textAlign: 'center' }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                {t.errorNotFound}
            </div>
        );
    }

    const allImages = vehicle.images && vehicle.images.length > 0 
        ? vehicle.images 
        : [{ url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070' }];

    const rentalDays = startDate && endDate ? Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))) : 0;

    return (
        <div className="details-container">
            <div className="details-header">
                <div className="header-main">
                    <h1>{vehicle.brand} <span>{vehicle.model}</span></h1>
                    <div className="price-tag">
                        <span className="amount">${vehicle.dailyPrice}</span>
                        <span className="per-day">/ {t.perDay}</span>
                    </div>
                </div>
            </div>

            <div className="details-grid-v2">
                <div className="vehicle-info-main">
                    <div className="vehicle-gallery-wrapper">
                        <Swiper
                            navigation={true}
                            pagination={{ clickable: true }}
                            mousewheel={true}
                            keyboard={true}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[Navigation, Pagination, Mousewheel, Keyboard, Thumbs]}
                            className="main-vehicle-swiper"
                            grabCursor={true}
                        >
                            {allImages.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img src={img.url} alt={`${vehicle.brand} ${index}`} className="swiper-vehicle-img" />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {allImages.length > 1 && (
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[Navigation, Thumbs]}
                                className="thumbs-vehicle-swiper"
                            >
                                {allImages.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="thumb-img-box">
                                            <img src={img.url} alt={`Thumb ${index}`} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    <div className="real-car-features">
                        <h2>{t.specifications}</h2>
                        <div className="features-grid">
                            <div className="feature-item">
                                <i className="fas fa-gas-pump"></i>
                                <div>
                                    <span>{t.fuelType}</span>
                                    <strong>{vehicle.fuelType}</strong>
                                </div>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-calendar-alt"></i>
                                <div>
                                    <span>{t.yearModel}</span>
                                    <strong>{vehicle.year}</strong>
                                </div>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-calendar-alt"></i>
                                <div>
                                    <span>{t.modelLabel}</span>
                                    <strong>{vehicle.model}</strong>
                                </div>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-calendar-alt"></i>
                                <div>
                                    <span>{t.licensePlate}</span>
                                    <strong>{vehicle.licensePlate}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="booking-sidebar">
                    <div className={`booking-card ${bookingMutation.isPending ? 'submitting' : ''}`}>
                        {bookingMutation.isPending && (
                            <div className="booking-overlay">
                                <div className="mini-loader"></div>
                            </div>
                        )}
                        <div className="card-header">
                            <h3>{t.sidebarTitle}</h3>
                            <p>{t.sidebarSubtitle}</p>
                        </div>
                        <form onSubmit={handleBooking}>
                            <div className="form-group date-picker-group">
                                <label><i className="far fa-calendar"></i> {t.datesLabel}</label>
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                        const [start, end] = update;
                                        setStartDate(start);
                                        setEndDate(end);
                                    }}
                                    minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                    excludeDateIntervals={bookedDates}
                                    isClearable={true}
                                    placeholderText={t.placeholderDates}
                                    className="custom-datepicker-input" 
                                    required
                                />
                            </div>

                            {startDate && endDate && (
                                <div className="invoice-breakdown">
                                    <h4>{t.invoiceTitle}</h4>
                                    <div className="invoice-row">
                                        <span>{t.dailyRate}</span>
                                        <span>${vehicle.dailyPrice} x {rentalDays} {t.daysCount}</span>
                                    </div>
                                    <div className="invoice-row">
                                        <span>{t.taxesLabel}</span>
                                        <span className="free-badge">{t.includedBadge}</span>
                                    </div>
                                    <div className="invoice-total">
                                        <span>{t.totalAmount}</span>
                                        <strong>${(rentalDays * vehicle.dailyPrice).toFixed(2)}</strong>
                                    </div>
                                </div>
                            )}

                            <div className="terms-checkbox-group">
                                <label className="checkbox-container">
                                    <input 
                                        type="checkbox" 
                                        checked={acceptedTerms} 
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="checkbox-text">
                                        {t.termsCheckboxText} <Link to="/terms" target="_blank">{t.termsLinkText}</Link>
                                    </span>
                                </label>
                            </div>
                            <button 
                                type="submit" 
                                className="confirm-glow-btn" 
                                disabled={bookingMutation.isPending}
                            >
                                {bookingMutation.isPending ? t.btnProcessing : (user ? t.btnReserve : t.btnLoginToBook)}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsPage;