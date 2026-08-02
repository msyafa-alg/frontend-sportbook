import { Link } from "react-router-dom";
import { MessageCircle, Send, Globe, Video, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const QUICK = [
    { to: "/", label: "Beranda" },
    { to: "/fields", label: "Venue" },
    { to: "/my-bookings", label: "Riwayat Booking" },
    { to: "/register", label: "Daftar" },
];

const COMPANY = [
    { to: "/about", label: "Tentang Kami" },
    { to: "/about", label: "Karier" },
    { to: "/about", label: "Kemitraan Venue" },
];

const SUPPORT = [
    { to: "/faq", label: "Pusat Bantuan" },
    { to: "/terms", label: "Syarat & Ketentuan" },
    { to: "/privacy", label: "Kebijakan Privasi" },
];

const SOCIALS = [
    { icon: MessageCircle, label: "Chat" },
    { icon: Send, label: "Send" },
    { icon: Globe, label: "Website" },
    { icon: Video, label: "Video" },
];

export default function FooterComponent() {
    return (
        <footer className="bg-ink text-slate-400">
            <div className="container mx-auto px-4 sm:px-6 pt-16 pb-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-10">
                    {/* brand + newsletter */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" className="text-primary">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" opacity="0.35" />
                                <path d="M12 7.2c1.7.5 3 .2 3.9-.5.6-.5.5-1.5-.3-2.1-3.1-2.1-7.2-2.2-10.4-.4-.6.3-.6 1.1.1 1.3 1.8.5 3.2.7 4.7 1.7z" fill="currentColor" />
                                <path d="M5.6 8.7c.9 1.6 2.2 2.6 3.9 2.6 1.6 0 2.7-.8 3.9-2 .7.9 2.1 1 3.2.8-1-1.6-2.9-2.3-4.8-1.5-.8-1.1-.9-2.3-1-3.4-1.3 1-2.4 2.1-3.2 2.5-1.4.1-1.8-.8-2-.9z" fill="currentColor" />
                            </svg>
                            <span className="font-extrabold text-lg text-white tracking-tight">sportbook</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs mb-6">
                            Platform booking lapangan olahraga online yang mudah, cepat, dan terpercaya untuk semua.
                        </p>
                        <div className="max-w-sm">
                            <p className="text-sm font-semibold text-white mb-2">Dapatkan promo terbaru</p>
                            <div className="flex items-center gap-2 p-1.5 bg-white/10 rounded-full border border-white/10">
                                <input type="email" placeholder="Alamat email kamu" className="flex-1 bg-transparent px-3.5 text-sm text-white placeholder:text-slate-500 outline-none" />
                                <button className="w-9 h-9 rounded-full bg-primary text-white grid place-items-center hover:bg-primary-dark transition-colors shrink-0">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* tautan cepat */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Tautan</h4>
                        <ul className="space-y-3 text-sm">
                            {QUICK.map((l) => (
                                <li key={l.label}><Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* perusahaan & bantuan (gabung 2 kolom jadi 1 blok untuk md) */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Perusahaan</h4>
                        <ul className="space-y-3 text-sm">
                            {COMPANY.map((l) => <li key={l.label}><Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link></li>)}
                            {SUPPORT.map((l) => <li key={l.label}><Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link></li>)}
                        </ul>
                    </div>

                    {/* kontak */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Kontak</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" /> Jl. Olahraga Merdeka No. 12, Jakarta</li>
                            <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary shrink-0" /> +62 812-3456-7890</li>
                            <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary shrink-0" /> halo@sportbook.id</li>
                        </ul>
                        <div className="flex gap-2.5 mt-6">
                            {SOCIALS.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <a key={s.label} href="#" aria-label={s.label}
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 grid place-items-center text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-colors">
                                        <Icon className="w-4.5 h-4.5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <span>© 2026 SportBook. All rights reserved.</span>
                    <span className="inline-flex items-center gap-1.5"><span className="text-amber-400">★★★★★</span> Rated 4.9/5 by 15K+ users</span>
                </div>
            </div>
        </footer>
    );
}