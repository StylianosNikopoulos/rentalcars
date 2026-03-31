import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">RENTAL<span>CAR</span></Link>
                        <p className="footer-tagline">
                            Premium fleet. Seamless execution. <br/> The thrill of the drive.
                        </p>
                    </div>

                    <div className="footer-grid">
                        <div className="footer-nav">
                            <Link to="/">About</Link>
                            <Link to="/">Terms</Link>
                            <Link to="/">Privacy</Link>
                        </div>
                        <div className="footer-contact">
                            <a href="mailto:info@rentalcar.com">info@rentalcar.com</a>
                            <a href="tel:+30231055555">+30 231 055 555</a>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <p className="copyright">&copy; {new Date().getFullYear()} RENTALCAR. ATHENS, GR.</p>
                    <div className="footer-socials">
                        <a href="#" target="_blank" rel="noreferrer">INSTAGRAM</a>
                        <a href="#" target="_blank" rel="noreferrer">FACEBOOK</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;