import api from './api';

export const appointmentService = {
  book: (payload) => api.post('/appointments', payload),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, null, { params: { status } }),
  cancel: (id) => api.delete(`/appointments/${id}`),
  getAll: () => api.get('/appointments'), // ADMIN only
};
