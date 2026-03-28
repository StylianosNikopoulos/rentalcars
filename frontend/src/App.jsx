import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Navbar />
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route 
                path="/vehicles" 
                element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} 
            />
            <Route 
                path="/profile" 
                element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
            />
            <Route 
                path="/vehicle/:id" 
                element={<ProtectedRoute><VehicleDetailsPage /></ProtectedRoute>} 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;