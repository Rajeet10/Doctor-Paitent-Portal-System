import api from './api';

export const doctorService = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  getSlots: (id) => api.get(`/doctors/${id}/slots`),
  getAvailableSlots: (id) => api.get(`/doctors/${id}/available-slots`),
  addSlot: (id, payload) => api.post(`/doctors/${id}/slots`, payload),
  getAppointments: (id) => api.get(`/appointments/doctor/${id}`),
};
