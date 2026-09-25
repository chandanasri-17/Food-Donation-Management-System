import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('food_bridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (localStorage.getItem('food_bridge_token')) {
        localStorage.removeItem('food_bridge_token');
        localStorage.removeItem('food_bridge_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Donation Endpoints
export const donationAPI = {
  create: (data) => api.post('/donations', data),
  getAll: (params) => api.get('/donations', { params }),
  getMyDonations: () => api.get('/donations/my-donations'),
  getMyClaims: () => api.get('/donations/my-claims'),
  getById: (id) => api.get(`/donations/${id}`),
  accept: (id) => api.patch(`/donations/${id}/accept`),
  updateStatus: (id, status) => api.patch(`/donations/${id}/status`, { status }),
  delete: (id) => api.delete(`/donations/${id}`),
  getImpactStats: () => api.get('/donations/stats/impact'),
};

// Notification Endpoints
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export default api;
