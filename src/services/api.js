import axios from "axios";

// membuat axios instance dengan base URL dari .env
// semua request API akan menggunakan instance ini
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// interceptor : otomatis menambahkan token JWT ke setiap request
// mirip seperti middleware di backend
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default api;
