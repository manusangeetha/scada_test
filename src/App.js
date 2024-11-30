import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AHU from './pages/AHU';
import EnergyMeter from './pages/EnergyMeter';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container vh-100 d-flex flex-column">
          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />


            <Route path="/energy-meter" element={<EnergyMeter />} />
            <Route path="/ahu" element={<AHU />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Wrapper component for report page with authentication check
const ReportWrapper = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger text-center">
          Please log in to access this page.
        </div>
      </div>
    );
  }

};

export default App;
