import api from './api';

export const donorService = {
  register: (payload) => api.post('/donors', payload),
  getAll: () => api.get('/donors'),
  search: (params) => api.get('/donors/search', { params }),
};
