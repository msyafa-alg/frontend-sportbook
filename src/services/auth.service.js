import api from "./api";

// service : tempat semua fungsi yang berhubungan dengan API auth
// dipisah dari halaman agar kode lebih rapi dan mudah dipakai ulang

export async function loginService(username, password) {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
}

export async function registerService(name, username, password, email) {
    const response = await api.post("/auth/register", { name, username, password, email });
    return response.data;
}

export async function getProfileService() {
    const response = await api.get("/auth/profile");
    return response.data;
}

export async function updateProfileService(formData) {
    const response = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function changePasswordService(current_password, new_password) {
    const response = await api.put("/auth/change-password", { current_password, new_password });
    return response.data;
}
