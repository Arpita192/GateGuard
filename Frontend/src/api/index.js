import axios from 'axios';

// The URL where your backend server is running
const API_URL = "http://localhost:3001/api";

// Create the Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Use the interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        // --- THIS IS THE CORRECTED LOGIC ---
        // 1. Get the user info object from localStorage
        const userInfoString = localStorage.getItem('userInfo');

        if (userInfoString) {
            // 2. Parse the object to access its properties
            const userInfo = JSON.parse(userInfoString);
            
            // 3. Get the token from inside the userInfo object
            if (userInfo.token) {
                // 4. Attach the token to the request header
                config.headers['Authorization'] = `Bearer ${userInfo.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;