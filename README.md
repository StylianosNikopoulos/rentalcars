# RentalCars - Full Stack Vehicle Reservation System

A production-ready Car Rental application built with **Spring Boot 3** and **React**, following **Hexagonal Architecture (Ports and Adapters)** principles for high maintainability, scalability, and clean code standards.

---

## Live Demo & Deployment Info
**Frontend URL:** [https://rentalcars-v95l.onrender.com/](https://rentalcars-v95l.onrender.com)

The application is fully deployed and accessible:
* **Frontend:** Hosted on **Render** (Static Service)
* **Backend:** Hosted on **Render** (Web Service)
* **Database:** Managed via **Supabase** (PostgreSQL)
* **Payment Processing:** Integrated with **Stripe API** (Test Mode)

### Cold Start Mitigation (The "Keep-Alive" Hack)
Since the application is hosted on **Render's Free Tier**, the backend service normally "spins down" after 15 minutes of inactivity. 
To ensure a smooth user experience, I have implemented a **Warm-up Strategy**:
* **Cron-job Integration:** An external monitoring service pings the `/api/v1/vehicles` endpoint every 10 minutes.
* **Result:** This keeps the Spring Boot application "warm," significantly reducing cold start delays (from 60s down to near-instant).

---

## Architectural Pattern: Hexagonal

The project strictly follows the **Hexagonal Architecture** to ensure a clean separation of concerns and business logic independence:

1.  **Domain Layer:** Core business logic and entities (e.g., Vehicle, Reservation), completely framework-agnostic.
2.  **Application Layer:** Input/Output Ports (Interfaces) and Use Case implementations that coordinate the flow of data.
3.  **Infrastructure Layer:** External adapters such as:
    * **Persistence:** PostgreSQL (via Supabase) using Spring Data JPA.
    * **Security:** JWT-based stateless authentication.
    * **Payments:** Stripe API integration for secure checkout.
    * **Storage:** Cloudinary for vehicle image management.

---

## Tech Stack

### Backend
* **Java 21 & Spring Boot 3**
* **Spring Security:** Role-Based Access Control (RBAC) with JWT authentication.
* **Liquibase:** For version-controlled database schema migrations.
* **Hibernate/JPA:** Optimized with **Custom Queries** and **DB Indexing** for performance.

### Frontend
* **React.js (Vite):** Functional components.
* **State Management:** Context API & custom hooks (e.g., `useAuth`).
* **UI/UX:** Custom CSS3, Responsive Design and React-Datepicker.

### DevOps & Environments
* **Cloud Deployment:** Hosted on **Render** (Static site for Frontend, Web Service for Backend, SupaBase for Postgres).
* **Local Development:** Full stack orchestration via **Docker & Docker Compose**, utilizing **Nginx** as a Reverse Proxy to mirror production-like routing locally.

---

## Performance Optimization
To ensure scalability and data integrity, the system implements:
* **Database Indexing:** Strategic indexes for search efficiency.
* **Concurrency Guard:** Frontend "Submitting" states and backend transactional integrity to prevent double-bookings during high latency.
* **N+1 Solution:** Optimized JPQL and Native queries to reduce database roundtrips.

---

## Local Setup & Installation

### 📋 Prerequisites
* **Docker & Docker Compose** (Latest version)
* **Node.js (v18 or higher)** & **npm**
* **Java 21 JDK** (Only if you want to run the Spring Boot app outside Docker)
* **Stripe Account** (To obtain Test API Keys)

Create a `.env` file in the root directory (like .env.example):

```
docker-compose up --build -d
cd frontend
npm install
npm run dev

Frontend UI	http://localhost:5173	Main React application (Vite)
Local API Gateway	http://localhost:80/api/v1	Nginx Reverse Proxy entry point
Direct Backend API	http://localhost:8080	Spring Boot REST endpoints
PostgreSQL DB	localhost:5432	Accessible via DBeaver
