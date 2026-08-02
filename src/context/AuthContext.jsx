import { createContext, useState, useEffect } from "react";
import { getProfileService } from "../services/auth.service";

// AuthContext : menyimpan state login agar bisa diakses di semua halaman
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [isLogin, setIsLogin] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState(() => {
        try {
            return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
        } catch (e) { return null; }
    });

    // simpan user ke localStorage agar update persist saat refresh
    function persist(token, userData) {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    function updateToken(token, userData) {
        setIsLogin(token);
        setUser(userData);
        if (token) persist(token, userData);
    }

    // ambil profil terbaru dari server saat halaman dimuat (biar foto/email terbaru)
    async function refreshProfile() {
        try {
            const r = await getProfileService();
            setUser(r.data);
            localStorage.setItem("user", JSON.stringify(r.data));
        } catch (e) { /* token mungkin invalid */ }
    }

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            refreshProfile();
        }
    }, []);

    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setIsLogin(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ isLogin, user, updateToken, refreshProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
}