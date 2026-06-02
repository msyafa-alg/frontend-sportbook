import api from "./api";

// service untuk semua request yang berhubungan dengan payment

export async function payBookingService(kode_pembayaran) {
    const response = await api.post("/payments/pay", { kode_pembayaran });
    return response.data;
}

// admin : ambil semua payment
export async function getAllPaymentsService(params = {}) {
    const response = await api.get("/payments/admin/all", { params });
    return response.data;
}
