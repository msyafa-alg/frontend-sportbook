import api from "./api";

// service untuk semua request yang berhubungan dengan lapangan

export async function getFieldsService(params = {}) {
    const response = await api.get("/fields", { params });
    return response.data;
}

export async function getFieldByIdService(id) {
    const response = await api.get(`/fields/${id}`);
    return response.data;
}

export async function createFieldService(formData) {
    // pakai FormData karena ada upload gambar
    const response = await api.post("/fields", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function updateFieldService(id, formData) {
    const response = await api.put(`/fields/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function deleteFieldService(id) {
    const response = await api.delete(`/fields/${id}`);
    return response.data;
}
