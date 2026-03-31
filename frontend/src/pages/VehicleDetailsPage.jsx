import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import reservationService from '../services/reservationService'; 
import toast from 'react-hot-toast';
import '../assets/styles/details.css';

const VehicleDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '' });

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const data = await vehicleService.getVehicleById(id);
                setVehicle(data);
            } catch (error) {
                toast.error("Vehicle not found");
                navigate('/vehicles');
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id, navigate]);

    const handleBooking = async (e) => {
        e.preventDefault(); 

        const bookingData = {
            vehicleId: vehicle.id,
            startDate: bookingDates.startDate + "T10:00:00", 
            endDate: bookingDates.endDate + "T10:00:00"  
        };

        if (!bookingData.startDate || !bookingData.endDate) {
            toast.error("Please select both dates");
            return;
        }

        try {
            await reservationService.createReservation(bookingData);
            toast.success("Reservation successful!");
            
            setTimeout(() => {
                navigate('/reservations');
            }, 1500);
            
        } catch (error) {
            console.error("Booking Error:", error);
            toast.error(error.response?.data?.message || "Booking failed");
        }
    };

    if (loading) return <div className="loader">Loading details...</div>;
    if (!vehicle) return null;

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
                <span className="spec-badge">
                    <i className="fas fa-car"></i> {vehicle.type}
                </span>
                <span className="spec-badge">
                    <i className="fas fa-gas-pump"></i> {vehicle.fuelType}
                </span>
                <span className="spec-badge">
                    <i className="fas fa-calendar-alt"></i> {vehicle.year}
                </span>
                <span className="spec-badge">
                    <i className="fas fa-id-card"></i> {vehicle.licensePlate}
                </span>
            </div>
        </div>

        <div className="details-grid-v2">
            <div className="vehicle-main-image">
                <img 
                    src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070'} 
                    alt={vehicle.model} 
                />
            </div>
            
            <div className="booking-sidebar">
                <div className="booking-card">
                    <div className="card-header">
                        <h3>Book Reservation</h3>
                        <p>Select your dates and confirm</p>
                    </div>
                    <form onSubmit={handleBooking}>
                        <div className="form-group">
                            <label>Pick-up Date</label>
                            <input 
                                type="date" 
                                required 
                                min={new Date().toISOString().split('T')[0]}
                                value={bookingDates.startDate}
                                onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Return Date</label>
                            <input 
                                type="date" 
                                required 
                                min={bookingDates.startDate || new Date().toISOString().split('T')[0]}
                                value={bookingDates.endDate}
                                onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="confirm-glow-btn">
                            Confirm
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
};

export default VehicleDetailsPage;