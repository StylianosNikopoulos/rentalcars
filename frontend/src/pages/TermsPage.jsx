import React from 'react';
import '../assets/styles/terms.css';

const TermsPage = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>
          Terms & <span className="text-primary">Conditions</span>
        </h1>
        <p className="subtitle">
          Rental Agreement & Data Protection Policy
        </p>
      </div>

      <div className="terms-content">

        <section className="terms-section">
          <h2>1. Data Protection (GDPR)</h2>
          <p>
            We are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR).
            We collect only the information necessary to provide our car rental services, including name, email address,
            and valid driving license details.
          </p>

          <ul>
            <li>
              <strong>Legal Basis:</strong> Data processing is required for the performance of a rental contract.
            </li>
            <li>
              <strong>Data Usage:</strong> Your data is used exclusively for booking, payment processing, and service delivery.
            </li>
            <li>
              <strong>Data Retention:</strong> Personal data is retained only for as long as required by applicable legal and tax obligations.
            </li>
            <li>
              <strong>Your Rights:</strong> You have the right to access, update, or request deletion of your personal data at any time.
            </li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>2. Rental Requirements</h2>
          <p>
            To rent a vehicle, customers must be at least 21 years old and hold a valid driving license for a minimum of two years.
            Additional verification may be required depending on the vehicle category.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Booking & Cancellation Policy</h2>
          <p>
            Reservations may be cancelled up to 24 hours prior to the scheduled pick-up time for a full refund.
            Late cancellations may be subject to applicable fees depending on the booking terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Third-Party Services</h2>
          <p>
            The platform may use third-party services such as payment processors (e.g. Stripe) to complete transactions securely.
            These providers process data under their own privacy policies.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsPage;