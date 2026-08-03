import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { getMyBookingsService, cancelBookingService } from "../services/booking.service";
import { getActiveVouchersService } from "../services/stats.service";
import { getNotificationsService } from "../services/notification.service";
import { useSeo } from "../utils/seo";
import FooterComponent from "../components/FooterComponent";
import {
    CalendarDays, Ticket, Bell, UserRound, ArrowRight, CheckCircle2, Clock, XCircle, LayoutDashboard
} from "lucide-react";
import { useToast } from "../context/ToastContext";

const BADGE = {
    pending: "bg-slate-100 text-slate-600",
    waiting_payment: "bg-violet-100 text-violet-700",
    paid: "bg-blue-100 text-blue-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-600",
    cancelled: "bg-slate-200 text-slate-600",
};

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function AccountDashboard() {
    useSeo("Dashboard Saya", "Dashboard ringkasan akun dan riwayat aktivitas SportBook.");
    const { user } = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        try {
            const [bRes, vRes, nRes] = await Promise.all([
                getMyBookingsService({ limit: 5 }),
                getActiveVouchersService(),
                getNotificationsService({ limit: 5 })
            ]);
            setBookings(bRes.data.data || []);
            setVouchers(vRes.data || []);
            setNotifications(nRes.data.list || []);
        } catch (e) {
            toast.error("Gagal memuat data dashboard.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCancel(id) {
        if (!confirm("Yakin ingin membatalkan booking ini?")) return;
        try {
            await cancelBookingService(id);
            toast.success("Booking berhasil dibatalkan.");
            loadData();
        } catch (e) {
            toast.error("Gagal membatalkan booking.");
        }
    }

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            loadData();
        }
    }, [user]);

    if (!user || loading) {
        return (
            <div className="min-h-screen bg-canvas py-12 flex justify-center items-center">
                <div className="text-center font-bold text-muted">Memuat Dashboard...</div>
            </div>
        );
    }

    const totalSpend = bookings
        .filter(b => b.status === "approved" || b.status === "paid")
        .reduce((sum, b) => sum + (b.total_price || 0), 0);

    return (
        <div className="bg-canvas min-h-screen flex flex-col">
            <div className="bg-ink text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold">Halo, {user.name}!</h1>
                        <p className="text-white/60 mt-1">Selamat datang kembali di pusat aktivitas olahragamu.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/profile" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-full border border-white/20 text-sm transition-all">
                            <UserRound className="w-4 h-4" /> Edit Profil
                        </Link>
                        <Link to="/fields" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 rounded-full shadow-lg shadow-primary/25 text-sm transition-all">
                            Sewa Lapangan <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card border border-line rounded-2xl p-6 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center"><CalendarDays className="w-6 h-6" /></div>
                        <div>
                            <p className="text-2xl font-extrabold text-ink">{bookings.length}</p>
                            <p className="text-xs font-semibold text-muted">Total Transaksi</p>
                        </div>
                    </div>
                    <div className="bg-card border border-line rounded-2xl p-6 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
                        <div>
                            <p className="text-2xl font-extrabold text-emerald-700">{bookings.filter(b => b.status === 'approved').length}</p>
                            <p className="text-xs font-semibold text-muted">Booking Aktif</p>
                        </div>
                    </div>
                    <div className="bg-card border border-line rounded-2xl p-6 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center"><Ticket className="w-6 h-6" /></div>
                        <div>
                            <p className="text-2xl font-extrabold text-amber-700">Rp {totalSpend.toLocaleString("id-ID")}</p>
                            <p className="text-xs font-semibold text-muted">Total Pengeluaran</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Booking Terakhir */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-line rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-ink text-base">Booking Terakhir</h2>
                                <Link to="/my-bookings" className="text-xs font-bold text-primary hover:underline">Lihat Semua</Link>
                            </div>
                            {bookings.length === 0 ? (
                                <p className="text-sm text-muted">Belum ada pemesanan. Mulai sewa lapangan olahraga pertamamu!</p>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((b) => (
                                        <div key={b.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 border border-line rounded-xl">
                                            <div>
                                                <p className="font-bold text-ink text-sm">{b.Field?.name || "Lapangan"}</p>
                                                <p className="text-xs text-muted mt-1">{b.booking_date} • {b.start_time?.slice(0, 5)}–{b.end_time?.slice(0, 5)}</p>
                                            </div>
                                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${BADGE[b.status] || "bg-slate-100"}`}>{b.status}</span>
                                                <div className="flex gap-2">
                                                    {['pending', 'waiting_payment'].includes(b.status) && (
                                                        <button onClick={() => handleCancel(b.id)} className="text-xs font-semibold text-red-500 hover:underline">Batalkan</button>
                                                    )}
                                                    <Link to={`/booking/${b.id}`} className="text-xs font-bold text-primary hover:underline">Detail</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Promo & Notifikasi */}
                    <div className="space-y-6">
                        {/* Promo */}
                        <div className="bg-card border border-line rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-ink text-base mb-4 flex items-center gap-2"><Ticket className="w-5 h-5 text-primary" /> Promo Aktif</h2>
                            {vouchers.length === 0 ? (
                                <p className="text-xs text-muted">Saat ini tidak ada promo aktif.</p>
                            ) : (
                                <div className="space-y-3">
                                    {vouchers.map((v, i) => (
                                        <div key={i} className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                            <p className="font-bold text-primary text-sm tracking-wide">{v.code}</p>
                                            <p className="text-xs text-ink/80 mt-1">Diskon {v.discount_type === 'percent' ? `${v.discount_value}%` : `Rp ${v.discount_value.toLocaleString("id-ID")}`}</p>
                                            {v.min_order > 0 && <p className="text-[10px] text-muted mt-0.5">Min. order Rp {v.min_order.toLocaleString("id-ID")}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notifikasi */}
                        <div className="bg-card border border-line rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-ink text-base mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifikasi Terbaru</h2>
                            {notifications.length === 0 ? (
                                <p className="text-xs text-muted">Tidak ada notifikasi.</p>
                            ) : (
                                <div className="space-y-3">
                                    {notifications.map((n, i) => (
                                        <div key={i} className="text-xs border-b border-line pb-2.5 last:border-0 last:pb-0">
                                            <p className="text-ink font-medium leading-snug">{n.message}</p>
                                            <p className="text-[10px] text-muted mt-1">{new Date(n.createdAt).toLocaleDateString("id-ID")}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}