import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Quiz API
export const quizAPI = {
  getSubjects: () => api.get('/quiz/subjects'),
  getTopics: (subject) => api.get(`/quiz/topics/${subject}`),
  getQuestions: (topic, limit = 10) => api.get(`/quiz/questions/${topic}?limit=${limit}`),
  submitQuiz: (answers) => api.post('/quiz/submit', { answers }),
};

// Results API
export const resultsAPI = {
  saveResult: (resultData) => api.post('/results', resultData),
  getUserResults: (userId) => api.get(`/results/${userId}`),
  getPerformanceSummary: (userId) => api.get(`/results/summary/${userId}`),
};

export default api;
