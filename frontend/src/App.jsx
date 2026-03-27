import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
    <Toaster position="top-center" toastOptions={{duration: 1000, style: {background: '#4400ff',color: '#fff',},}} />      
      <Routes>
        <Route path="/" element={<div><h1>Home Page</h1></div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;