import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/common/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';  // Fixed import path
import { AuthProvider } from './contexts/AuthContext';
import ProfileWizard from './components/profile/ProfileWizard'; 
import ManageSlots from './components/doctor/ManageSlots';
import BookAppointment from './components/patient/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MedicalRecords from './pages/MedicalRecords';
import DonorSearch from './pages/DonorSearch';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                  {/* Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              {/* ✅ NEW: Profile Wizard Route */}
              <Route path="/profile-wizard" element={
                <PrivateRoute>
                  <ProfileWizard />
                </PrivateRoute>
              } />
              
              {/* Optional: Add a catch-all route */}
              <Route path="*" element={
                <div className="container mt-5">
                  <div className="text-center">
                    <h2>404 - Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                </div>
              } />
              {/* Doctor pages */}
                <Route path="/doctor/slots" element={
                  <PrivateRoute><div className="container mt-4"><ManageSlots /></div></PrivateRoute>
                } />
                <Route path="/doctor/appointments" element={
                  <PrivateRoute><div className="container mt-4"><MedicalRecords /></div></PrivateRoute>
                } />

                {/* Patient pages */}
                <Route path="/appointments/book" element={
                  <PrivateRoute><div className="container mt-4"><BookAppointment /></div></PrivateRoute>
                } />
                <Route path="/appointments/my" element={
                  <PrivateRoute><div className="container mt-4"><MyAppointments /></div></PrivateRoute>
                } />

                {/* Common */}
                <Route path="/records" element={
                  <PrivateRoute><div className="container mt-4"><MedicalRecords /></div></PrivateRoute>
                } />
                <Route path="/donors" element={
                  <PrivateRoute><div className="container mt-4"><DonorSearch /></div></PrivateRoute>
                } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;