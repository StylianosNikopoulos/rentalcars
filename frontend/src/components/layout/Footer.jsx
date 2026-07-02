import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/footer.css'; 

const Footer = () => {
    return (
        <footer className="footer-root">
            <div className="footer-main-container">
                <div className="footer-top-grid">
                    <div className="footer-brand-column">
                        <Link to="/" className="footer-main-logo">RENTAL<span>CAR</span></Link>
                        <p className="footer-brand-tagline">
                        </p>
                    </div>

                    <div className="footer-nav-column">
                        <h4>Company</h4>
                        <div className="footer-links-list">
                            <Link to="/about">About Us</Link>
                            <Link to="/vehicles">Our Fleet</Link>
                        </div>
                    </div>

                    <div className="footer-nav-column">
                        <h4>Legal</h4>
                        <div className="footer-links-list">
                            <Link to="/terms">Terms & Conditions</Link>
                        </div>
                    </div>

                    <div className="footer-nav-column">
                        <h4>Contact</h4>
                        <div className="footer-links-list">
                            <a href="mailto:info@rentalcar.com">info@rentalcar.com</a>
                            <a href="tel:+30231055555">+30 231 055 555</a>
                        </div>
                    </div>
                </div>

                <div className="footer-main-divider"></div>

                <div className="footer-bottom-bar">
                    <p className="footer-copyright">&copy; {new Date().getFullYear()} RENTALCAR</p>
                    <div className="footer-social-links">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">INSTAGRAM</a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">FACEBOOK</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;