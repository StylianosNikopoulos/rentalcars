import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import vehicleService from '../services/vehicleService'; 
import '../assets/styles/home.css';

const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const data = await vehicleService.getAllVehicles();
                setVehicles(data.slice(0, 3)); 
            } catch (error) {
                console.error("Error fetching vehicles", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    return (
        <div className="home-page">
            <header className="hero">
                <h1>Premium Car Rentals</h1>
                <p>Drive your dream car today. Affordable prices, world-class service.</p>
            </header>

            <section className="vehicle-container">
                <h2>Featured Fleet</h2>
                {loading ? (
                    <div className="loader">INITIALIZING...</div>
                ) : (
                    <div className="vehicle-grid">
                        {vehicles.map(car => (
                            <div key={car.id} className="vehicle-item">
                                <div className="vehicle-img-wrapper">
                                    <img 
                                        src={car.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070'} 
                                        alt={car.model} 
                                        className="vehicle-img" 
                                    />
                                </div>
                                <div className="vehicle-details">
                                    <div>
                                        <h3 className="car-name">{car.brand} {car.model}</h3>
                                        <div className="car-specs">{car.type} / AUTOMATIC / {car.fuelType || 'EV'}</div>
                                    </div>
                                    <div className="car-price-tag">
                                        <div className="price-value">${car.pricePerDay}</div>
                                        <div style={{fontSize: '0.7rem', color: '#555'}}>PER DAY</div>
                                    </div>
                                </div>
                                <button 
                                    className="rent-btn-minimal" 
                                    onClick={() => navigate(`/vehicle/${car.id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button className="rent-btn-minimal" onClick={() => navigate('/vehicles')}>
                        View All Vehicles
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;