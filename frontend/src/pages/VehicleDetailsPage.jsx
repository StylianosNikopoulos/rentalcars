import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import '../assets/styles/home.css';

const VehicleDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
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
        try {
            toast.success(`Booking request sent for ${vehicle.brand}!`);
            navigate('/profile'); 
        } catch (error) {
            toast.error("Failed to create booking.");
        }
    };

    if (loading) return <div className="loader">Loading details...</div>;
    if (!vehicle) return null;

    return (
        <div className="details-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1-fr 1fr', gap: '2rem' }}>
                <div className="vehicle-image-section">
                    <img src={vehicle.imageUrl} alt={vehicle.model} style={{ width: '100%', borderRadius: '15px' }} />
                </div>
                
                <div className="vehicle-info-section">
                    <h1>{vehicle.brand} {vehicle.model}</h1>
                    <p className="type-tag">{vehicle.year}</p>
                    <p className="type-tag">{vehicle.licensePlate}</p>
                    <p className="type-tag">{vehicle.type} {vehicle.fuelType}</p>
                    <h2 className="price">${vehicle.dailyPrice} / day</h2>
                    
                    <form onSubmit={handleBooking} className="booking-form" style={{ marginTop: '2rem' }}>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input 
                                type="date" 
                                required 
                                onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>End Date</label>
                            <input 
                                type="date" 
                                required 
                                onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="auth-button" style={{ marginTop: '2rem', width: '100%' }}>
                            Confirm Booking
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsPage;