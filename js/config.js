/*
 * Global configuration for Contact Book.
 * Using a relative API path keeps the frontend and API on the same origin.
 * This avoids browser CORS issues between coppoosd.com and www.coppoosd.com.
 */
const API_BASE_URL = "/LAMPAPI";
const API_EXTENSION = "php";

// Keep this false for production. Set true only when testing the UI without the backend.
const USE_MOCK_CONTACTS = false;
