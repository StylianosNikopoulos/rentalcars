import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../assets/styles/about.css';

const AboutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-container">
        <div className="portfolio-alert">
            <div className="alert-content">
                <i className="fas fa-laptop-code"></i>
                <div className="alert-text">
                    <h4>Software Engineering Showcase</h4>
                    <p>
                        This platform is a <strong>professional technical demonstration</strong>. 
                        While it features a fully functional booking engine and payment simulation, 
                        it is intended for <strong>portfolio display only</strong>. No real-world 
                        rentals are processed.
                    </p>
                </div>
            </div>
        </div>

        <div className="about-content-wrapper">
            <div className="section-header">
                <p>The Vision</p>
                <h2>Engineered for <span className="text-primary">Performance</span></h2>
            </div>

        <div className="about-grid">
        <div className="about-card">
            <div className="about-icon"><i className="fab fa-docker"></i></div>
            <h3>Containerized Deployment</h3>
            <p>
                The entire ecosystem is <strong>Dockerized</strong> for seamless scaling and 
                deployment. Using <strong>Docker Compose</strong>, the Spring Boot API and 
                PostgreSQL database are orchestrated to ensure environment consistency.
            </p>
        </div>

            <div className="about-card">
                <div className="about-icon"><i className="fas fa-server"></i></div>
                <h3>Spring Boot Backend</h3>
                <p>
                    A high-performance <strong>RESTful API</strong> built with Java and Spring Boot. 
                    Features complex business logic, <strong>JPA/Hibernate</strong> for data 
                    persistence, and advanced filtering for vehicle availability.
                </p>
             </div>
                <div className="about-card">
                    <div className="about-icon"><i className="fas fa-shield-alt"></i></div>
                    <h3>Secure Auth Flow</h3>
                    <p>
                        Enterprise-grade security using <strong>JWT (JSON Web Tokens)</strong>. 
                        Implementation of custom Security Filters and Role-Based Access Control 
                        to protect user data and administrative actions.
                    </p>
                </div>
             </div>
            <div className="about-cta-section">
                <p>Want to see the technical implementation?</p>
                <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
                    <button className="explore-btn" onClick={() => navigate('/vehicles')}>
                        Try the Demo
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default AboutPage;