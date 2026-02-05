import axios from 'axios';

// Create an Axios instance
const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7114/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor for API calls
httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        // We do NOT handle tenantId from storage here based on the new requirements (implied context)
        // But for now, user asked to keep it consistent. 
        // The previous implementation had tenantId logic, I'll keep the token logic clean.

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
httpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Handle specific error cases (e.g., 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Optional: Dispatch logout event or redirect
            // For now, we just reject to let the caller handle it or Context handle it
        }
        return Promise.reject(error);
    }
);

export default httpClient;
