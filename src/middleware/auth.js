import { redirect } from "react-router-dom";

// middleware untuk melindungi route yang butuh login
// sama persis polanya dengan template platzi-fake-store
export function auth() {
    const token = localStorage.getItem("access_token");
    if (!token) {
        // kalau belum login, arahkan ke halaman login
        return redirect("/login");
    }
    return null;
}

// middleware khusus untuk route admin
export function authAdmin() {
    const token = localStorage.getItem("access_token");
    if (!token) {
        return redirect("/login");
    }
    // cek role dari data user yang disimpan di localStorage
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    if (!user || user.role !== "admin") {
        // kalau bukan admin, arahkan ke halaman utama
        return redirect("/");
    }
    return null;
}
