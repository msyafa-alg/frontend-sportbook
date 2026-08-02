import { useState, useEffect } from "react";
import BookingCardComponent from "../components/BookingCardComponent";
import LoadingComponent from "../components/LoadingComponent";
import FooterComponent from "../components/FooterComponent";
import { getMyBookingsService, cancelBookingService } from "../services/booking.service";
import { payBookingService } from "../services/payment.service";
import { HiCheck, HiX, HiInformationCircle } from "react-icons/hi";

const FILTERS = [
    { value: "all", label: "Semua" },
    { value: "waiting_payment", label: "Menunggu Bayar" },
    { value: "paid", label: "Dibayar" },
    { value: "approved", label: "Disetujui" },
    { value: "rejected", label: "Ditolak" },
    { value: "cancelled", label: "Dibatalkan" },
];

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [kodePembayaran, setKodePembayaran] = useState("");
    const [payLoading, setPayLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [filter, setFilter] = useState("all");

    async function getMyBookings() {
        try {
            const result = await getMyBookingsService();
            setBookings(result.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    async function handlePay() {
        if (!kodePembayaran.trim()) {
            setError("Masukkan kode pembayaran terlebih dahulu!");
            return;
        }
        setPayLoading(true);
        setError("");
        try {
            await payBookingService(kodePembayaran.trim());
            setSuccess("Pembayaran berhasil! Menunggu konfirmasi admin.");
            setKodePembayaran("");
            getMyBookings();
        } catch (error) {
            setError(error.response?.data?.data || "Pembayaran gagal! Cek kode pembayaran kamu.");
        } finally {
            setPayLoading(false);
        }
    }

    useEffect(() => { getMyBookings(); }, []);

    async function handleCancel(id) {
        if (!confirm("Yakin ingin membatalkan booking ini?")) return;
        setError("");
        try {
            await cancelBookingService(id);
            setSuccess("Booking berhasil dibatalkan.");
            getMyBookings();
        } catch (error) {
            setError(error.response?.data?.data || "Gagal membatalkan booking.");
        }
    }

    const displayedBookings = filter === "all"
        ? bookings
        : bookings.filter((b) => b.status === filter);

    return (
        <>
            {/* sub-header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-5">
                <div className="container mx-auto">
                    <h1 className="text-lg font-bold text-gray-900">
                        Riwayat <span className="text-orange-500">Booking</span>
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-3xl">
                {/* notifikasi */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-4">
                        <HiX className="shrink-0" /> <span>{error}</span>
                        <button onClick={() => setError("")} className="ml-auto text-red-400">✕</button>
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded mb-4">
                        <HiCheck className="shrink-0" /> <span>{success}</span>
                    </div>
                )}

                {/* panel pembayaran */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
                    <h2 className="text-sm font-bold text-gray-800 mb-1">Simulasi Pembayaran</h2>
                    <p className="text-xs text-gray-400 mb-3 flex items-start gap-1">
                        <HiInformationCircle className="shrink-0 mt-0.5 text-gray-400" />
                        Masukkan kode pembayaran (PAY-xxx) yang kamu terima setelah booking
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Contoh: PAY-1717000000000"
                            value={kodePembayaran}
                            onChange={(e) => setKodePembayaran(e.target.value)}
                            className="flex-1 border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <button
                            onClick={handlePay}
                            disabled={payLoading}
                            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-5 py-2.5 rounded text-sm transition-colors whitespace-nowrap"
                        >
                            {payLoading ? "Memproses..." : "BAYAR"}
                        </button>
                    </div>
                </div>

                {/* filter status */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                                filter === f.value
                                    ? "bg-orange-500 text-white"
                                    : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* daftar booking */}
                {loading ? (
                    <LoadingComponent />
                ) : displayedBookings.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="font-medium">Belum ada riwayat booking</p>
                        <p className="text-sm mt-1">Yuk, booking lapangan pertamamu</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {displayedBookings.map((booking) => (
                            <BookingCardComponent key={booking.id} booking={booking} onCancel={handleCancel} />
                        ))}
                    </div>
                )}
            </div>

            <FooterComponent />
        </>
    );
}
