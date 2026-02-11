import api from './api';

export const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  register: (userData) => {
    return api.post('/users', userData);
  },

  registerPatient: (patientData) => {
    return api.post('/auth/register', patientData);
  },

  registerDoctor: (doctorData) => {
    return api.post('/auth/register', doctorData);
  },

  getProfile: () => {
    return api.get('/users/profile');
  },

  updatePatientProfile: (patientId, profileData) => {
    return api.put(`/patients/${patientId}`, profileData);
  },
  
  updateDoctorProfile: (doctorId, profileData) => {
    return api.put(`/doctors/${doctorId}`, profileData);
  }

};