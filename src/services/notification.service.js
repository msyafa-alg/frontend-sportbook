import api from "./api";

// service untuk notifikasi user

export async function getNotificationsService(params = {}) {
    const response = await api.get("/notifications", { params });
    return response.data;
}

export async function readAllNotificationsService() {
    const response = await api.put("/notifications/read-all");
    return response.data;
}

export async function readNotificationService(id) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
}