import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import vehicleService from '../services/vehicleService';
import '../assets/styles/vehicles.css'; 
import { useQuery } from '@tanstack/react-query';

const VehiclesPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default"); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const queryParams = new URLSearchParams(location.search);
    const selectedStart = queryParams.get('start');
    const selectedEnd = queryParams.get('end');

    const rentalDays = selectedStart && selectedEnd 
        ? Math.max(1, Math.ceil((new Date(selectedEnd) - new Date(selectedStart)) / (1000 * 60 * 60 * 24)))
        : 0;

    const { data: vehicles = [], isLoading, isError } = useQuery({
        queryKey: ['vehicles', selectedStart, selectedEnd], 
        queryFn: async () => {
            if (selectedStart && selectedEnd) {
                return await vehicleService.getAvailableVehicles(selectedStart, selectedEnd);
            }
            return await vehicleService.getAllVehicles();
        },
        staleTime: 1000 * 60 * 5, 
    });

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

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }); 
    };

    const handleCardClick = (carId) => {
        const searchPath = location.search ? location.search : "";
        navigate(`/vehicle/${carId}${searchPath}`);
    };

    if (isError) return <div className="error-message">Error loading fleet. Please try again later.</div>;

    return (
        <div className="vehicles-page">
            <div className="vehicles-header">
                <h1>Our Premium Fleet</h1>

                {selectedStart && selectedEnd && (
                    <div className="availability-info-banner">
                        <div className="availability-text">
                            <i className="far fa-calendar-check"></i>
                            <span>Showing available fleet for: </span>
                            <strong>{formatDate(selectedStart)}</strong>
                            <span className="date-separator">→</span>
                            <strong>{formatDate(selectedEnd)}</strong>
                            <span className="days-badge">({rentalDays} {rentalDays === 1 ? 'day' : 'days'})</span>
                        </div>
                        <button className="clear-dates-btn" onClick={() => navigate('/vehicles')}>
                            RESET DATES
                        </button>
                    </div>
                )}
                
                <div className="filters-bar">
                    <div className="search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input 
                            type="text" 
                            placeholder="Search by brand or model (e.g., Audi, Tesla)..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
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
                </div>
            </div>

            {isLoading ? (
                <div className="loader">FETCHING FLEET...</div>
            ) : (
                <>
                    <div className="vehicle-grid">
                        {currentItems.map(car => (
                            <div key={car.id} className="vehicle-item" onClick={() => handleCardClick(car.id)}>
                                <div className="vehicle-img-wrapper">
                                    <img 
                                        src={
                                            car.images && car.images.length > 0 
                                                ? (car.images.find(img => img.isMain)?.url || car.images[0].url) 
                                                : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070'
                                        } 
                                        alt={`${car.brand} ${car.model}`} 
                                        className="vehicle-img" 
                                    />
                                </div>
                                
                                <div className="vehicle-card-body">
                                    <div className="vehicle-title-section">
                                        <h3 className="car-name">{car.brand} <span>{car.model}</span></h3>
                                        <span className="car-year">{car.year}</span>
                                    </div>

                                    <div className="card-mini-specs">
                                        <span><i className="fas fa-pump-soap"></i> {car.fuelType}</span>
                                        <span><i className="fas fa-cog"></i> {car.licensePlate}</span>
                                    </div>

                                    <div className="card-pricing-footer">
                                        <div className="car-price-tag">
                                            <span className="price-value">€{car.dailyPrice}</span>
                                            <span className="price-label">/ day</span>
                                        </div>
                                        
                                        {rentalDays > 0 && (
                                            <div className="total-price-badge">
                                                <span>Total for {rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                                                <strong>€{(car.dailyPrice * rentalDays).toFixed(0)}</strong>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button className="rent-btn-minimal">
                                    View Deal <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1} 
                                className="page-btn"
                            >
                                <i className="fas fa-chevron-left"></i> PREVIOUS
                            </button>
                            <span className="page-info">Page {currentPage} of {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages} 
                                className="page-btn"
                            >
                                NEXT <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </>
            )}
            
            {filteredVehicles.length === 0 && !isLoading && (
                <div className="no-results">No vehicles matching your criteria were found.</div>
            )}
        </div>
    );
};

export default VehiclesPage;