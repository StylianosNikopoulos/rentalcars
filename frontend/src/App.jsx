import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar'; 
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import VehiclesPage from './pages/VehiclesPage';
import NotFound from './pages/NotFound'; 
import MyReservationPage from './pages/MyReservationPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop /> 
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            className: 'react-hot-toast', 
            style: {
              background: '#151515',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '0px', 
              fontSize: '14px',
              padding: '12px 20px',
            },
            success: {
              iconTheme: { primary: '#ff4d00', secondary: '#fff' },
              style: { border: '1px solid rgba(255, 77, 0, 0.5)' }
            },
            error: {
              style: { border: '1px solid #ff0000' }
            },
            duration: 4000,
          }}
        />
        
        <Navbar />
        
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/vehicles" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetailsPage /></ProtectedRoute>} />
            <Route path="/reservations" element={<ProtectedRoute><MyReservationPage /></ProtectedRoute>} />     
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;