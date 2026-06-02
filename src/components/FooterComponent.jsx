import { Link } from "react-router-dom";
import { MdSportsSoccer } from "react-icons/md";

export default function FooterComponent() {
    return (
        <footer className="bg-[#1a1a2e] text-gray-400 mt-16">
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                                <MdSportsSoccer className="text-white text-sm" />
                            </div>
                            <span className="text-white font-bold tracking-tight">sportbook</span>
                        </div>
                        <p className="text-xs leading-relaxed max-w-xs">
                            Platform booking lapangan olahraga online yang mudah dan terpercaya.
                        </p>
                    </div>

                    <div className="flex gap-12 text-sm">
                        <div>
                            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-3">Menu</h4>
                            <ul className="space-y-2 text-xs">
                                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link to="/fields" className="hover:text-white transition-colors">Venue</Link></li>
                                <li><Link to="/my-bookings" className="hover:text-white transition-colors">Booking</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-3">Akun</h4>
                            <ul className="space-y-2 text-xs">
                                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-5 text-center text-xs">
                    © 2026 SportBook. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
