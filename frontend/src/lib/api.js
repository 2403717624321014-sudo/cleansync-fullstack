import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:8000', // Backend URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor for easier error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Return a uniform error object or just the data
        const customError = {
            message: error.response?.data?.detail || error.message || 'Something went wrong',
            status: error.response?.status,
        };
        return Promise.reject(customError);
    }
);

export default api;
