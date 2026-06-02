import { createContext, useState } from "react";

// AuthContext : menyimpan state login agar bisa diakses di semua halaman
// sama persis polanya dengan template platzi-fake-store
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    // ambil token dari localStorage saat pertama kali load
    const [isLogin, setIsLogin] = useState(localStorage.getItem("access_token"));

    // ambil data user yang disimpan saat login
    const [user, setUser] = useState(
        localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    );

    function updateToken(token, userData) {
        setIsLogin(token);
        setUser(userData);
    }

    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        // set state ke null agar navbar langsung update
        setIsLogin(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ isLogin, user, updateToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
