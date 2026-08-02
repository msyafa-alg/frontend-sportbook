import api from "./api";

// service untuk admin mengelola voucher

export async function getAllVouchersService() {
    const response = await api.get("/admin/vouchers");
    return response.data;
}

export async function createVoucherService(data) {
    const response = await api.post("/admin/vouchers", data);
    return response.data;
}

export async function deleteVoucherService(id) {
    const response = await api.delete(`/admin/vouchers/${id}`);
    return response.data;
}