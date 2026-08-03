import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { getBookingByIdService } from "../services/booking.service";
import { useSeo } from "../utils/seo";
import FooterComponent from "../components/FooterComponent";
import { QRCodeSVG } from "qrcode.react";
import { Printer, Calendar, Clock, DollarSign, Tag, ArrowLeft, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";

const STATUS_ICONS = {
    approved: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    paid: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
    pending: <Clock3 className="w-5 h-5 text-slate-500" />,
    waiting_payment: <Clock3 className="w-5 h-5 text-violet-600" />,
    rejected: <XCircle className="w-5 h-5 text-red-600" />,
    cancelled: <XCircle className="w-5 h-5 text-slate-400" />,
};

const STATUS_TEXT = {
    pending: "Menunggu Konfirmasi",
    waiting_payment: "Menunggu Pembayaran",
    paid: "Sudah Dibayar",
    approved: "Disetujui",
    rejected: "Ditolak",
    cancelled: "Dibatalkan",
};

export default function BookingDetailPage() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            const r = await getBookingByIdService(id);
            setBooking(r.data);
        } catch (e) {
            toast.error("Gagal memuat detail booking.");
            navigate("/my-bookings");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [id]);

    useSeo(booking ? `Detail Booking #${booking.id}` : "Detail Booking");

    if (loading) {
        return (
            <div className="min-h-screen bg-canvas py-12 flex justify-center items-center">
                <div className="text-center font-bold text-muted">Memuat Detail Booking...</div>
            </div>
        );
    }

    if (!booking) return null;

    const qrValue = JSON.stringify({
        id: booking.id,
        user: booking.User?.name || user?.name,
        field: booking.Field?.name,
        date: booking.booking_date,
        time: `${booking.start_time?.slice(0, 5)}–${booking.end_time?.slice(0, 5)}`,
    });

    return (
        <div className="bg-canvas min-h-screen flex flex-col">
            <div className="container mx-auto px-4 sm:px-6 py-8 flex-1 max-w-3xl">
                <Link to="/my-bookings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat
                </Link>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Invoice detail */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-card border border-line rounded-[20px] p-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
                                <div>
                                    <h1 className="text-lg font-extrabold text-ink">E-Invoice #{booking.id}</h1>
                                    <p className="text-xs text-muted mt-0.5">Tanggal Pemesanan: {new Date(booking.createdAt).toLocaleDateString("id-ID")}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {STATUS_ICONS[booking.status] || <Clock3 />}
                                    <span className="text-xs font-bold text-ink">{STATUS_TEXT[booking.status] || booking.status}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-muted uppercase">Tanggal Jadwal</p>
                                        <p className="text-sm font-semibold text-ink mt-0.5">{booking.booking_date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-muted uppercase">Jam Sewa</p>
                                        <p className="text-sm font-semibold text-ink mt-0.5">{booking.start_time?.slice(0, 5)} – {booking.end_time?.slice(0, 5)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-muted uppercase">Nama Lapangan</p>
                                        <p className="text-sm font-semibold text-ink mt-0.5">{booking.Field?.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-line mt-6 pt-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-muted">Total Pembayaran</p>
                                    <p className="text-xl font-extrabold text-primary mt-0.5">Rp {booking.total_price?.toLocaleString("id-ID")}</p>
                                </div>
                                <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 border border-line hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-all">
                                    <Printer className="w-4 h-4" /> Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* QR Code / E-ticket */}
                    <div className="md:col-span-1">
                        <div className="bg-card border border-line rounded-[20px] p-6 shadow-sm text-center flex flex-col items-center">
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">E-Ticket QR</p>
                            {booking.status === "approved" ? (
                                <>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-line">
                                        <QRCodeSVG value={qrValue} size={140} level="M" />
                                    </div>
                                    <p className="text-xs text-muted mt-4 leading-relaxed">Tunjukkan QR code ini ke petugas lapangan saat tiba di lokasi untuk check-in.</p>
                                </>
                            ) : (
                                <div className="py-8 px-4 border border-dashed border-line rounded-2xl w-full flex flex-col items-center justify-center min-h-[180px]">
                                    <XCircle className="w-8 h-8 text-muted mb-2" />
                                    <p className="text-xs font-bold text-ink">E-Ticket Belum Tersedia</p>
                                    <p className="text-[10px] text-muted mt-1 leading-snug">E-ticket &amp; QR Code hanya aktif untuk pesanan yang disetujui admin.</p>
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