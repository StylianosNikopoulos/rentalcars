import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import vehicleService from '../services/vehicleService'; 
import toast from 'react-hot-toast'; 
import '../assets/styles/home.css';

const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
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

    const handleSearch = () => {
        if (!startDate || !endDate) {
            toast.error("Please select both pickup and return dates");
            return;
        }

        const sDate = startDate.toISOString().split('T')[0];
        const eDate = endDate.toISOString().split('T')[0];

        navigate(`/vehicles?start=${sDate}&end=${eDate}`);
    };

    return (
        <div className="home-page">
            <header className="hero">
                <div className="hero-content">
                    <span className="hero-badge">Premium Car Rental</span>
                    <h1>Luxury <br/><span className="text-outline">Vehicles</span></h1>
                    <p>Unlock the journey of your life with our exclusive fleet of world-class automobiles.</p>
                    
                    <div className="search-widget-v2">
                        <div className="search-field">
                            <i className="fas fa-map-marker-alt field-icon"></i>
                            <div className="field-inputs">
                                <label>Pick-up Location</label>
                                <input type="text" value="Thessaloniki Airport" />
                            </div>
                        </div>

                        <div className="search-field">
                            <i className="far fa-calendar-alt field-icon"></i>
                            <div className="field-inputs">
                                <label>Rental Timeline</label>
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                        const [start, end] = update;
                                        setStartDate(start);
                                        setEndDate(end);
                                    }}
                                    minDate={new Date()}
                                    isClearable={true}
                                    placeholderText="Select Dates Range"
                                    className="custom-home-datepicker" 
                                    dateFormat="dd MMM yyyy"
                                />
                            </div>
                        </div>

                        <button className="search-btn-v2" onClick={handleSearch}>
                            Search Fleet <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* FEATURED FLEET SECTION */}
            <section className="featured-fleet-section">
                <div className="section-header-v2">
                    <h2>Featured Fleet</h2>
                    <p>Explore our most popular vehicles available right now</p>
                </div>

                {loading ? (
                    <div className="mini-fleet-loader">Loading premium fleet...</div>
                ) : (
                    <div className="home-vehicle-grid">
                        {vehicles.map(car => (
                            <div key={car.id} className="home-vehicle-card" onClick={() => navigate(`/vehicle/${car.id}`)}>
                                <div className="home-car-img-wrapper">
                                    <img 
                                        src={car.images && car.images.length > 0 ? car.images[0].url : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070'} 
                                        alt={`${car.brand} ${car.model}`} 
                                    />
                                    <span className="home-car-tag">{car.type || 'Premium'}</span>
                                </div>
                                <div className="home-car-info">
                                    <h3>{car.brand} <span>{car.model}</span></h3>
                                    <div className="home-car-specs-row">
                                        <span><i className="fas fa-cog"></i> {car.transmission || 'Auto'}</span>
                                        <span><i className="fas fa-gas-pump"></i> {car.fuelType}</span>
                                    </div>
                                    <div className="home-car-price-row">
                                        <div className="home-price">
                                            <strong>€{car.dailyPrice}</strong>
                                            <span>/ day</span>
                                        </div>
                                        <button className="home-view-deal-btn">Book Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* WHY US FEATURES SECTION */}
            <section className="features-section">
                <div className="section-header-v2">
                    <h2>The Rental Experience</h2>
                    <p>Why corporate professionals and luxury travelers choose our services</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <h3>Fully Insured</h3>
                        <p>Comprehensive coverage for total peace of mind on every mile you drive.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-road"></i>
                        </div>
                        <h3>Unlimited Miles</h3>
                        <p>No boundaries, no limits. Explore the destination at your own pace.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-headset"></i>
                        </div>
                        <h3>24/7 Support</h3>
                        <p>Our dedicated team is always a call away, anywhere, anytime.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;