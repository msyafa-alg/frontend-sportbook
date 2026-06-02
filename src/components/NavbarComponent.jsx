import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiUser, HiClipboardList, HiLogout, HiChevronDown } from "react-icons/hi";
import { MdSportsSoccer } from "react-icons/md";

export default function NavbarComponent() {
    const { isLogin, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-0">
            <div className="container mx-auto flex items-center justify-between h-14">

                {/* logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <MdSportsSoccer className="text-white text-lg" />
                    </div>
                    <span className="font-bold text-gray-900 text-lg tracking-tight">sportbook</span>
                </Link>

                {/* nav links */}
                <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-gray-600 uppercase">
                    <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
                    <Link to="/fields" className="hover:text-orange-500 transition-colors">Venue</Link>
                    {isLogin && (
                        <Link to="/my-bookings" className="hover:text-orange-500 transition-colors">Booking</Link>
                    )}
                </div>

                {/* auth area */}
                <div className="flex items-center gap-3">
                    {isLogin && user?.role === "admin" && (
                        <Link
                            to="/admin"
                            className="text-xs font-semibold text-orange-500 border border-orange-400 px-3 py-1.5 rounded hover:bg-orange-50 transition-colors"
                        >
                            ADMIN PANEL
                        </Link>
                    )}

                    {isLogin ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden md:block">{user?.name}</span>
                                <HiChevronDown className="text-gray-400 text-xs" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 top-10 w-44 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1">
                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <HiUser className="text-gray-400" /> Profile
                                    </Link>
                                    <Link
                                        to="/my-bookings"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <HiClipboardList className="text-gray-400" /> Riwayat Booking
                                    </Link>
                                    <hr className="my-1 border-gray-100" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                                    >
                                        <HiLogout /> Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/register"
                                className="text-xs font-bold tracking-widest text-gray-700 hover:text-orange-500 transition-colors px-2 py-1.5"
                            >
                                REGISTER
                            </Link>
                            <Link
                                to="/login"
                                className="text-xs font-bold tracking-widest bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
                            >
                                LOGIN
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
