import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import NavChat from "./NavChat";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu, X, ChevronDown, User, CalendarCheck, CalendarDays, LayoutDashboard, LogOut, CircleUserRound, MessageSquare,
} from "lucide-react";

const NAV = [
    { to: "/", label: "Beranda" },
    { to: "/fields", label: "Venue" },
    { to: "/my-bookings", label: "Booking" },
];

export default function NavbarComponent() {
    const { isLogin, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const [mobile, setMobile] = useState(false);

    // tutup dropdown saat pindah halaman
    useEffect(() => { setOpen(false); setMobile(false); }, [pathname]);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-line/70">
            <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
{/* logo */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" className="text-primary group-hover:text-primary-dark transition-colors">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" opacity="0.35" />
                        <path d="M12 7.2c1.7.5 3 .2 3.9-.5.6-.5.5-1.5-.3-2.1-3.1-2.1-7.2-2.2-10.4-.4-.6.3-.6 1.1.1 1.3 1.8.5 3.2.7 4.7 1.7z" fill="currentColor" />
                        <path d="M5.6 8.7c.9 1.6 2.2 2.6 3.9 2.6 1.6 0 2.7-.8 3.9-2 .7.9 2.1 1 3.2.8-1-1.6-2.9-2.3-4.8-1.5-.8-1.1-.9-2.3-1-3.4-1.3 1-2.4 2.1-3.2 2.5-1.4.1-1.8-.8-2-.9z" fill="currentColor" />
                        <path d="M20.4 8.1c-.2-.5-.7-.6-1.1-.3l-1.1.9c-.5.4-.4 1.1.1 1.4l1 .6c.5.3 1.1.1 1.3-.4.2-.8.1-1.6-.2-2.2z" fill="currentColor" />
                        <path d="M5.9 14.7c1.1-.9 1.7-1.9 1.8-3 1.3.7 3.1 1 4.3.9-.2 2.4 1.3 4.6 3.4 5.3-1.5 1.6-3.9 2.5-6.3 2.2-2-.2-3.7-1.5-4.4-3.4-.2-.8.3-2 .2-2z" fill="currentColor" />
                        <path d="M14.9 18.6c1.3-.2 2.4-.9 3.2-1.9-.2 1.4-1.2 2.4-2.5 2.8-.9.3-1.4-.3-1.4-.8z" fill="currentColor" />
                    </svg>
                    <span className="leading-none">
                        <span className="font-extrabold text-lg tracking-tight text-ink">sportbook</span>
                        <span className="block text-[10px] font-medium text-muted tracking-wide">Booking Lapangan</span>
                    </span>
                </Link>

                {/* menu */}
                <nav className="hidden md:flex items-center gap-9 text-[15px] font-semibold text-muted">
                    {NAV.map((m) => {
                        const active = m.to === "/" ? pathname === "/" : pathname.startsWith(m.to);
                        return (
                            <Link
                                key={m.to}
                                to={m.to}
                                className={`relative group transition-colors duration-200 ${active ? "text-primary" : "hover:text-ink"}`}
                            >
                                {m.label}
                                <span className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                            </Link>
                        );
                    })}
                </nav>

                {/* kanan */}
                <div className="flex items-center gap-2">
                    {isLogin ? (
                        <>
                            <NotificationBell />
                            <NavChat />
                            <div className="relative">
                            <button
                                onClick={() => setOpen((o) => !o)}
                                className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-full border border-line hover:shadow-md hover:border-primary/40 transition-all"
                            >
                                {user?.profile_picture ? (
                                    <img src={user.profile_picture} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                                ) : (
                                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-400 text-white flex items-center justify-center font-bold text-sm">
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                )}
                                <span className="hidden sm:block text-sm font-semibold text-ink max-w-[120px] truncate">{user?.name}</span>
                                <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl shadow-ink/10 border border-line overflow-hidden"
                                    >
                                        <div className="px-4 py-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-line">
                                            <p className="text-sm font-bold text-ink">{user?.name}</p>
                                            <p className="text-xs text-muted">@{user?.username}</p>
                                            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                {user?.role}
                                            </span>
                                        </div>
                                        <div className="py-1.5">
                                            {user?.role === "admin" && (
                                                <MenuLink to="/admin" icon={<LayoutDashboard />} onClick={() => setOpen(false)}>Admin Panel</MenuLink>
                                            )}
                                            <MenuLink to="/profile" icon={<CircleUserRound />} onClick={() => setOpen(false)}>Profile</MenuLink>
                                            <MenuLink to="/my-bookings" icon={<CalendarDays />} onClick={() => setOpen(false)}>Riwayat Booking</MenuLink>
                                            <MenuLink to={user?.role === "admin" ? "/admin/chat" : "/chat"} icon={<MessageSquare />} onClick={() => setOpen(false)}>Chat</MenuLink>
                                            <hr className="my-1.5 border-line" />
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium transition-colors">
                                                <LogOut className="w-[18px] h-[18px]" /> Keluar
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/login" className="text-sm font-semibold text-ink hover:text-primary px-4 py-2.5 rounded-full transition-colors">Masuk</Link>
                            <Link to="/register" className="text-sm font-semibold text-white bg-primary hover:bg-primary-dark px-5 py-2.5 rounded-full shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5">Daftar</Link>
                        </div>
                    )}

                    <button onClick={() => setMobile(!mobile)} className="md:hidden w-10 h-10 grid place-items-center rounded-xl hover:bg-slate-100 text-ink transition-colors">
                        {mobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* mobile */}
            <AnimatePresence>
                {mobile && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden border-t border-line bg-white"
                    >
                        <div className="px-6 py-4 flex flex-col gap-1">
                            {NAV.map((m) => (
                                <Link key={m.to} to={m.to} className="py-2.5 text-[15px] font-semibold text-ink hover:text-primary transition-colors">{m.label}</Link>
                            ))}
                            {isLogin ? (
                                <>
                                    {user?.role === "admin" && <Link to="/admin" className="py-2.5 text-[15px] font-semibold text-ink hover:text-primary">Admin Panel</Link>}
                                    <Link to="/profile" className="py-2.5 text-[15px] font-semibold text-ink hover:text-primary">Profile</Link>
                                    <Link to={user?.role === "admin" ? "/admin/chat" : "/chat"} className="py-2.5 text-[15px] font-semibold text-ink hover:text-primary">Chat</Link>
                                    <button onClick={handleLogout} className="py-2.5 text-left text-[15px] font-semibold text-red-500">Keluar</button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Link to="/login" className="text-center text-sm font-semibold text-ink border border-line py-2.5 rounded-full">Masuk</Link>
                                    <Link to="/register" className="text-center text-sm font-semibold text-white bg-primary py-2.5 rounded-full">Daftar</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function MenuLink({ to, icon, children, onClick }) {
    return (
        <Link to={to} onClick={onClick} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-slate-50 transition-colors">
            <span className="text-muted">{icon}</span> {children}
        </Link>
    );
}