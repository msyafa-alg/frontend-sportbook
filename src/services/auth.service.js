import api from "./api";

// service : tempat semua fungsi yang berhubungan dengan API auth
// dipisah dari halaman agar kode lebih rapi dan mudah dipakai ulang

export async function loginService(username, password) {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
}

export async function registerService(name, username, password) {
    const response = await api.post("/auth/register", { name, username, password });
    return response.data;
}
