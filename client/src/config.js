// Base URL for the backend API. Set REACT_APP_API_URL at build time when the
// frontend and backend are deployed to different origins; defaults to the
// local dev server.
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
