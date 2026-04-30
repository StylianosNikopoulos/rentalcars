import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../hooks/useAuth';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import vehicleService from '../services/vehicleService';
import reservationService from '../services/reservationService';
import toast from 'react-hot-toast';
import '../assets/styles/details.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const VehicleDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [bookedDates, setBookedDates] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [vehicleData, reservationsData] = await Promise.all([
                    vehicleService.getVehicleById(id),
                    reservationService.getVehicleReservations(id).catch(err => {
                        console.error("Reservations fetch failed:", err);
                        return []; 
                    })
                ]);
      
                setVehicle(vehicleData);

                const safeReservations = Array.isArray(reservationsData) ? reservationsData : [];
                const intervals = safeReservations.map(res => {
                    if (res.period && res.period.start && res.period.end) {
                        const dStart = new Date(res.period.start);
                        const dEnd = new Date(res.period.end);
                        dStart.setHours(0, 0, 0, 0);
                        dEnd.setHours(23, 59, 59, 999); 
                        return { start: dStart, end: dEnd };
                    }
                    return null;
                }).filter(i => i !== null);

                setBookedDates(intervals);
            } catch (error) {
                console.error("Error fetching data:", error);
                setBookedDates([]); 
                toast.error("Could not load availability");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault(); 

        if (isSubmitting) return;

        if (!user) {
            toast.error("Please login to make a reservation");
            navigate('/login');
            return;
        }

        if (!acceptedTerms) {
            toast.error("You must accept the Terms and GDPR policy to continue");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Please select both dates");
            return;
        }

        setIsSubmitting(true);

        const formatForBackend = (date) => {
            if (!date) return null;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}T10:00:00`;
        };

        const bookingData = {
            vehicleId: vehicle.id,
            startDate: formatForBackend(startDate),
            endDate: formatForBackend(endDate)
        };

        try {
            const response = await reservationService.createReservation(bookingData);
            toast.success("Reservation successful!");
            
            setTimeout(() => navigate('/reservations'), 1500);
        } catch (error) {
            console.error("Booking Error:", error);
            toast.error(error.response?.data?.message || "Booking failed");
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loader">Loading details...</div>;
    if (!vehicle) return <div className="error">Vehicle not found</div>;

    const allImages = vehicle.images && vehicle.images.length > 0 
        ? vehicle.images 
        : [{ url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070' }];

    return (
        <div className="details-container">
            <div className="details-header">
                <div className="header-main">
                    <h1>{vehicle.brand} <span>{vehicle.model}</span></h1>
                    <div className="price-tag">
                        <span className="amount">${vehicle.dailyPrice}</span>
                        <span className="per-day">/ day</span>
                    </div>
                </div>
                
                <div className="specs-badge-container">
                    <span className="spec-badge"><i className="fas fa-car"></i> {vehicle.brand}</span>
                    <span className="spec-badge"><i className="fas fa-gas-pump"></i> {vehicle.fuelType}</span>
                    <span className="spec-badge"><i className="fas fa-calendar-alt"></i> {vehicle.year}</span>
                    <span className="spec-badge"><i className="fas fa-id-card"></i> {vehicle.licensePlate}</span>
                </div>
            </div>

            <div className="details-grid-v2">
                <div className="vehicle-image-section">
                    <div className="vehicle-main-image-swiper">
                        <Swiper
                            navigation={true}
                            pagination={{ clickable: true }}
                            mousewheel={true}
                            keyboard={true}
                            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                            className="mySwiper"
                            grabCursor={true}
                        >
                            {allImages.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img 
                                        src={img.url} 
                                        alt={`${vehicle.brand} ${index}`} 
                                        className="swiper-vehicle-img"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                
                <div className="booking-sidebar">
                    <div className={`booking-card ${isSubmitting ? 'submitting' : ''}`}>
                        {isSubmitting && (
                        <div className="booking-overlay">
                            <div className="mini-loader"></div>
                        </div>
                        )}
                        <div className="card-header">
                            <h3>Book Reservation</h3>
                            <p>Select your dates and confirm</p>
                        </div>
                        <form onSubmit={handleBooking}>
                            <div className="form-group date-picker-group">
                                <label>Rental Period</label>
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
                                    placeholderText="Click to select dates"
                                    className="custom-datepicker-input" 
                                    required
                                />
                            </div>
                            {startDate && endDate && (
                                <div className="price-summary">
                                    <span>Total Price:</span>
                                    <strong>
                                        ${(Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))) * vehicle.dailyPrice).toFixed(2)}
                                    </strong>
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
                                        I have read and agree to the 
                                        <Link to="/terms" target="_blank">Terms & GDPR Policy</Link>
                                    </span>
                                </label>
                            </div>
                            <button 
                                type="submit" 
                                className="confirm-glow-btn" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending Request...' : (user ? 'Confirm Reservation' : 'Login to Book')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsPage;