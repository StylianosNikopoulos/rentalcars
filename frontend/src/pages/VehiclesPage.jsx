import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import '../assets/styles/vehicles.css'; 

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default"); 
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await vehicleService.getAllVehicles();
                setVehicles(data);
            } catch (error) {
                console.error("Error fetching vehicles", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const getProcessedVehicles = () => {
        let filtered = vehicles.filter(car => 
            car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortOrder === "low") {
            filtered.sort((a, b) => a.dailyPrice - b.dailyPrice);
        } else if (sortOrder === "high") {
            filtered.sort((a, b) => b.dailyPrice - a.dailyPrice);
        }

        return filtered;
    };

    const filteredVehicles = getProcessedVehicles();

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    return (
        <div className="vehicles-page">
            <div className="vehicles-header">
                <h1>Our Premium Fleet</h1>
                
                <div className="sort-container">
                    <select 
                        className="sort-select" 
                        onChange={(e) => {
                            setSortOrder(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="default">Sort By: Featured</option>
                        <option value="low">Price: Low to High</option>
                        <option value="high">Price: High to Low</option>
                    </select>
                </div>

                <div className="filters-bar">
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Search brand or model..." 
                            className="search-input"
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loader">FETCHING FLEET...</div>
            ) : (
                <>
                    <div className="vehicle-grid">
                        {currentItems.map(car => (
                            <div key={car.id} className="vehicle-item" onClick={() => navigate(`/vehicle/${car.id}`)}>
                                <div className="vehicle-img-wrapper">
                                    <img src={car.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070'} alt={car.model} className="vehicle-img" />
                                </div>
                                <div className="vehicle-details">
                                    <div>
                                        <h3 className="car-name">{car.brand} {car.model}</h3>
                                        <div className="car-specs">{car.type} • {car.fuelType}</div>
                                    </div>
                                    <div className="car-price-tag">
                                        <div className="price-value">${car.dailyPrice}</div>
                                        <div className="price-label">PER DAY</div>
                                    </div>
                                </div>
                                <button className="rent-btn-minimal">View Details</button>
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="page-btn">PREVIOUS</button>
                            <span className="page-info">Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="page-btn">NEXT</button>
                        </div>
                    )}
                </>
            )}
            
            {filteredVehicles.length === 0 && !loading && (
                <div className="no-results">No vehicles matching your criteria were found.</div>
            )}
        </div>
    );
};

export default VehiclesPage;