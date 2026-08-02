import api from "./api";

// service chat user & admin

// user
export async function getMyChatService() {
    const response = await api.get("/chat");
    return response.data;
}
export async function getChatUnreadService() {
    const response = await api.get("/chat/unread");
    return response.data;
}
export async function sendChatService(text, receiver_id) {
    const response = await api.post("/chat", { text, receiver_id });
    return response.data;
}

// admin
export async function getChatUsersService() {
    const response = await api.get("/admin/chat");
    return response.data;
}
export async function getChatConversationService(userId) {
    const response = await api.get(`/admin/chat/${userId}`);
    return response.data;
}
export async function sendAdminChatService(text, receiver_id) {
    const response = await api.post("/admin/chat", { text, receiver_id });
    return response.data;
}