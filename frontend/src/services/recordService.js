import api from './api';

export const recordService = {
  add: (payload) => api.post('/records', payload),
  getByPatient: (patientId) => api.get(`/records/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/records/doctor/${doctorId}`),
};
