import { useState, useContext } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthProvider from "../context/AuthContext";
import {
    MdDashboard,
    MdSportsSoccer,
    MdBookOnline,
    MdCreditCard,
    MdGroup,
    MdLogout,
    MdMenu,
} from "react-icons/md";

const menuItems = [
    { path: "/admin", label: "Dashboard", icon: MdDashboard, exact: true },
    { path: "/admin/fields", label: "Lapangan", icon: MdSportsSoccer },
    { path: "/admin/bookings", label: "Booking", icon: MdBookOnline },
    { path: "/admin/payments", label: "Pembayaran", icon: MdCreditCard },
    { path: "/admin/users", label: "User", icon: MdGroup },
];

// AdminLayout dibungkus AuthProvider karena tidak pakai Template
export default function AdminLayout() {
    return (
        <AuthProvider>
            <AdminLayoutInner />
        </AuthProvider>
    );
}

function AdminLayoutInner() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    function isActive(item) {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* ===== SIDEBAR ===== */}
            <aside className={`${collapsed ? "w-16" : "w-56"} bg-[#1a1a2e] flex flex-col transition-all duration-200 shrink-0`}>
                {/* logo */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                        <MdSportsSoccer className="text-white text-lg" />
                    </div>
                    {!collapsed && (
                        <span className="text-white font-bold text-sm tracking-tight">SportBook</span>
                    )}
                </div>

                {/* nav */}
                <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
                    {!collapsed && (
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-2 mb-2">
                            Menu
                        </p>
                    )}
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-orange-500 text-white"
                                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <Icon className="text-lg shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* user + logout */}
                <div className="border-t border-white/10 p-3">
                    {!collapsed && (
                        <div className="flex items-center gap-2 px-2 py-2 mb-1">
                            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
                                <p className="text-gray-500 text-xs">Admin</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-red-400 transition-colors text-sm"
                    >
                        <MdLogout className="text-lg shrink-0" />
                        {!collapsed && <span>Keluar</span>}
                    </button>
                </div>
            </aside>

            {/* ===== MAIN ===== */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* topbar */}
                <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <MdMenu className="text-xl" />
                        </button>
                        <h1 className="text-sm font-semibold text-gray-700">
                            {menuItems.find((m) => isActive(m))?.label || "Admin"}
                        </h1>
                    </div>
                    <Link to="/" className="text-xs text-gray-400 hover:text-orange-500 transition-colors">
                        Lihat Website
                    </Link>
                </header>

                {/* konten */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}