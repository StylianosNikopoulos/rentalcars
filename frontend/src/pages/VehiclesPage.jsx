import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import '../assets/styles/home.css'; 

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await vehicleService.getAllVehicles();
                setVehicles(data);
            } catch (error) {
                console.error("Error fetching all vehicles", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const filteredVehicles = vehicles.filter(car => 
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="vehicles-page" style={{ padding: '2rem' }}>
            <div className="vehicles-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1>Our Complete Fleet</h1>
                <p>Browse through our selection of premium vehicles</p>
                
                {/* Search Bar */}
                <input 
                    type="text" 
                    placeholder="Search brand or model..." 
                    className="search-input"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '20px',
                        border: '1px solid #ddd',
                        marginTop: '1rem'
                    }}
                />
            </div>

            {loading ? (
                <div className="loader">LOADING FLEET...</div>
            ) : (
                <div className="vehicle-grid">
                    {filteredVehicles.map(car => (
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
                                    <div className="car-specs">{car.type} / {car.fuelType}</div>
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
                                Book This Car
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {filteredVehicles.length === 0 && !loading && (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>No vehicles found matching your search.</p>
            )}
        </div>
    );
};

export default VehiclesPage;