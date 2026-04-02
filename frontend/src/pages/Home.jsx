import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import vehicleService from '../services/vehicleService'; 
import toast from 'react-hot-toast'; 
import '../assets/styles/home.css';
import '../assets/styles/footer.css';

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
                    <span className="hero-badge">Luxury & Performance</span>
                    <h1>Experience <br/><span className="text-outline">The Freedom</span></h1>
                    <p>Unlock the journey of your life with our exclusive fleet of world-class automobiles.</p>
                    
                    <div className="search-widget">
                        <div className="input-group">
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
                                minDate={new Date()}
                                isClearable={true}
                                placeholderText="Select Dates"
                                className="custom-datepicker-input" 
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                        <button className="search-btn" onClick={handleSearch}>
                            Find Your Car
                        </button>
                    </div>
                </div>
            </header>

            <section className="features-section">
                <div className="section-header">
                    <h2>Why Drive With Us</h2>
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