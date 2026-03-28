import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
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
        toast.success(`Booking request sent for ${vehicle.brand}!`);
        navigate('/profile');
    };

    if (loading) return <div className="loader">Loading details...</div>;
    if (!vehicle) return null;

    return (
        <div className="details-container">
            <div className="details-grid">
                <div className="vehicle-image-section">
                    <img src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070'} alt={vehicle.model} />
                </div>
                
                <div className="vehicle-info-section">
                    <h1>{vehicle.brand} {vehicle.model}</h1>
                    
                    <div className="specs-badge-container">
                        <span className="spec-badge">{vehicle.type}</span>
                        <span className="spec-badge">{vehicle.fuelType}</span>
                        <span className="spec-badge">{vehicle.year}</span>
                        <span className="spec-badge">{vehicle.licensePlate}</span>
                    </div>

                    <div className="price-display">${vehicle.dailyPrice} <span style={{fontSize: '1rem', color: '#666'}}>/ day</span></div>
                    
                    <div className="booking-card">
                        <h3>Reserve this vehicle</h3>
                        <form onSubmit={handleBooking}>
                            <div className="form-group">
                                <label>Pick-up Date</label>
                                <input 
                                    type="date" 
                                    required 
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Return Date</label>
                                <input 
                                    type="date" 
                                    required 
                                    min={bookingDates.startDate || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="rent-btn-minimal" style={{width: '100%', padding: '15px'}}>
                                Confirm Reservation
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsPage;