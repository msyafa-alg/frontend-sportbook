import api from "./api";

// service untuk semua request yang berhubungan dengan booking

export async function createBookingService(bookingData) {
    const response = await api.post("/bookings", bookingData);
    return response.data;
}

export async function getMyBookingsService(params = {}) {
    const response = await api.get("/bookings", { params });
    return response.data;
}

export async function getBookingByIdService(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
}

// admin : ambil semua booking
export async function getAllBookingsService(params = {}) {
    const response = await api.get("/bookings/admin/all", { params });
    return response.data;
}

// admin : approve booking
export async function approveBookingService(id) {
    const response = await api.put(`/bookings/admin/${id}/approve`);
    return response.data;
}

// admin : reject booking
export async function rejectBookingService(id) {
    const response = await api.put(`/bookings/admin/${id}/reject`);
    return response.data;
}
