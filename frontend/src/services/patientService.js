import api from './api';

export const patientService = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  getAppointments: (id) => api.get(`/appointments/patient/${id}`),
  getRecords: (id) => api.get(`/records/patient/${id}`),
  getActiveCount: () => api.get('/patients/count'), // ADMIN or DOCTOR
};
