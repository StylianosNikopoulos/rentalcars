import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import vehicleService from '../services/vehicleService'; 
import '../assets/styles/home.css';
import '../assets/styles/footer.css';

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
                <div className="hero-content">
                    <span className="hero-badge">Luxury & Performance</span>
                    <h1>Experience <br/><span className="text-outline">The Freedom</span></h1>
                    <p>Unlock the journey of your life with our exclusive fleet of world-class automobiles.</p>
                    
                    <div className="search-widget">
                        <div className="input-group">
                            <label>Dates</label>
                            <input type="date" />
                        </div>
                        <button className="search-btn" onClick={() => navigate('/vehicles')}>
                            Find Your Car
                        </button>
                    </div>
                </div>
            </header>

            <section className="vehicle-container">
                <div className="section-header">
                    <h2>Featured Fleet</h2>
                    <p>Select from our hand-picked top-tier vehicles for your next trip.</p>
                </div>

                {loading ? (
                    <div className="loader-wrapper">
                        <div className="minimal-loader"></div>
                    </div>
                ) : (
                <div className="vehicle-grid">
                    {vehicles.map(car => (
                        <div 
                            key={car.id} 
                            className="vehicle-item" 
                            onClick={() => navigate(`/vehicle/${car.id}`)} 
                        >
                            <div className="vehicle-img-wrapper">
                                <img 
                                    src={car.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070'} 
                                    alt={car.model} 
                                    className="vehicle-img" 
                                />
                                <div className="img-overlay"></div>
                                <div className="category-tag">{car.type}</div>
                            </div>
                            <div className="vehicle-details">
                                <div className="info">
                                    <h3 className="car-name">{car.brand} <span>{car.model}</span></h3>
                                    <div className="car-specs">
                                        <span>Turbocharged</span> • <span>Automatic</span> • <span>{car.fuelType || 'EV'}</span>
                                    </div>
                                </div>
                                <div className="car-price-tag">
                                    <span className="price-value">€{car.dailyPrice}</span>
                                    <span className="price-period">/day</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}
                
                <div className="view-all-wrapper">
                    <button className="explore-btn" onClick={() => navigate('/vehicles')}>
                        Explore Full Collection
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;