import React from 'react';
import '../assets/styles/terms.css';
const TermsPage = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Terms & <span className="text-primary">Conditions</span></h1>
        <p className="subtitle">GDPR Compliance & Rental Agreement</p>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Data Protection (GDPR)</h2>
          <p>
            We take your privacy seriously. In accordance with GDPR, we collect only the necessary 
            information to process your car rentals (Name, Email, Driver's License).
          </p>
          <ul>
            <li><strong>Right to be Forgotten:</strong> You can delete your account at any time. Your personal data will be anonymized.</li>
            <li><strong>Data Usage:</strong> We do not sell your data to third parties.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>2. Rental Policy</h2>
          <p>
            To rent a vehicle, you must be over 21 years old and hold a valid driver's license for at least 2 years.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Cancellation Policy</h2>
          <p>
            Reservations can be canceled up to 24 hours before the pick-up time for a full refund.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;