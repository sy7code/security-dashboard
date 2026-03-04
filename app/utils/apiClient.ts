import axios, { AxiosError } from "axios";

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// HTTP API Client instance centralizing default headers, interceptors
export const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
    // Backend requirement handling
    "ngrok-skip-browser-warning": "69420",
  },
  timeout: 10000,
});

// Configure Request Interceptor (e.g. JWT Token injection)
apiClient.interceptors.request.use(
  (config) => {
    // Example: const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configure Response Interceptor (e.g. Error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Custom error logging or Global toast dispatching can be done here.
    if (error.response?.status === 401) {
      console.warn("Unauthorized access - Redirecting to login...");
      // e.g. window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
