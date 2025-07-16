import axios from "axios";

// Array of production server URLs for failover
const PRODUCTION_SERVERS = [
  "https://test-series-1new.onrender.com/api",
  "https://test-series-backup-server1.onrender.com/api",
  "https://backup-server-test-series2.onrender.com/api",
];

let currentServerIndex = 0;

// Dynamic baseURL based on environment
const getBaseURL = () => {
  // Use environment variable if available, otherwise fallback to location-based detection
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback: Check if we're in development (localhost)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:8000/api";
  }
  // Production URL - use current server from array
  return PRODUCTION_SERVERS[currentServerIndex];
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Important for cookies / sessions
});

// Optional: request interceptor (can be omitted)
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally with failover
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if this is a server error and we're in production with multiple servers
    const isServerError = error.response?.status >= 500 || !error.response;
    const isProduction =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    const hasMoreServers = currentServerIndex < PRODUCTION_SERVERS.length - 1;

    if (
      isServerError &&
      isProduction &&
      hasMoreServers &&
      !originalRequest._retry
    ) {
      console.warn(
        `Server ${PRODUCTION_SERVERS[currentServerIndex]} failed, switching to backup...`
      );

      // Switch to next server
      currentServerIndex++;
      const newBaseURL = PRODUCTION_SERVERS[currentServerIndex];

      // Update the axios instance baseURL
      api.defaults.baseURL = newBaseURL;

      // Mark this request as retry to prevent infinite loops
      originalRequest._retry = true;
      originalRequest.baseURL = newBaseURL;

      console.log(`Retrying request with server: ${newBaseURL}`);

      // Retry the original request with new server
      return api(originalRequest);
    }

    if (error.response) {
      // Server responded with a status outside 2xx
      const { status, data } = error.response;

      console.error(`[API Error ${status}]`, data?.message || error.message);

      // Optional: Customize for specific error codes
      switch (status) {
        case 400:
          console.warn("Bad Request:", data?.message);
          break;
        case 403:
          console.warn("Forbidden:", data?.message);
          break;
        case 404:
          console.warn("Not Found:", data?.message);
          break;
        case 500:
          console.error("Server Error:", data?.message);
          break;
        case 509:
          console.warn("Conflict:", data?.message);
          break;
        default:
          console.warn("Unhandled Error:", data?.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received from server:", error.message);
    } else {
      // Something else went wrong
      console.error("API Setup Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
