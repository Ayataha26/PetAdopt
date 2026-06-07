import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Assuming local backend runs on port 5110 or standard 5000/5001. 
// We will use standard fallback or process environment.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5247/api';

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Automatically let the browser set the Content-Type with boundary for FormData
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            // Optional: Redirect to login page or show toast
        }
        return Promise.reject(error);
    }
);

export default apiClient;
