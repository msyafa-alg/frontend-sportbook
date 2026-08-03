import api from "./api";

export async function getAdminStatsService() {
    const response = await api.get("/admin/stats");
    return response.data;
}

export async function getActiveVouchersService() {
    const response = await api.get("/vouchers");
    return response.data;
}