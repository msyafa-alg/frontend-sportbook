import api from "./api";

// service untuk request admin mengelola user

export async function getAllUsersService(params = {}) {
    const response = await api.get("/admin/users", { params });
    return response.data;
}

export async function toggleBlockUserService(id) {
    const response = await api.put(`/admin/users/${id}/block`);
    return response.data;
}

export async function changeUserRoleService(id, role) {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
}

export async function resetUserPasswordService(id, new_password) {
    const response = await api.put(`/admin/users/${id}/reset-password`, { new_password });
    return response.data;
}