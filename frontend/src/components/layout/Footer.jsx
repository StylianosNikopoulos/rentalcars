import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">RentalCar</Link>
                    <p>Redefining the art of car rental. Premium fleet, seamless execution, and the thrill of the drive.</p>
                </div>

                <div className="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li><Link to="/">About Us</Link></li>
                        <li><Link to="/">Terms</Link></li>
                        <li><Link to="/">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="mailto:info@rentalcar.com">info@rentalcar.com</a></li>
                        <li><a href="tel:+1234567890">+30 231 055 555</a></li>
                        <li>Athens, Greece</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} rentalcar. All Rights Reserved.</p>
                <div className="social-links">
                    <a href="#">Instagram</a>
                    <a href="#">Facebook</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;