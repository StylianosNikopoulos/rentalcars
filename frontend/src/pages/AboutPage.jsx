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
                    <i className="fas fa-info-circle"></i>
                    <div className="alert-text">
                        <h4>Engineering Portfolio Project</h4>
                        <p>
                            This application is a full-stack software engineering project
                            built for demonstration purposes. It simulates a complete car rental
                            workflow including booking, authentication, and payments.
                        </p>
                    </div>
                </div>
            </div>

            <div className="about-content-wrapper">

                <div className="section-header">
                    <p>Overview</p>
                    <h2>Built with a focus on <span className="text-primary">scalability & clean architecture</span></h2>
                </div>

                <div className="about-grid">

                    <div className="about-card">
                        <div className="about-icon"><i className="fab fa-docker"></i></div>
                        <h3>Containerized Architecture</h3>
                        <p>
                            The backend and database are containerized to ensure consistent
                            development and deployment environments using Docker.
                        </p>
                    </div>

                    <div className="about-card">
                        <div className="about-icon"><i className="fas fa-server"></i></div>
                        <h3>Backend API</h3>
                        <p>
                            Built with Java Spring Boot, following REST principles with layered
                            architecture, JPA persistence, and structured business logic.
                        </p>
                    </div>

                    <div className="about-card">
                        <div className="about-icon"><i className="fas fa-shield-alt"></i></div>
                        <h3>Authentication & Security</h3>
                        <p>
                            Secure authentication system using JWT and role-based access control
                            to protect user and admin functionality.
                        </p>
                    </div>

                </div>

                <div className="about-cta-section">
                    <p>Explore the live demo and system flow</p>
                    <button
                        className="explore-btn"
                        onClick={() => navigate('/vehicles')}
                    >
                        Try Demo
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;