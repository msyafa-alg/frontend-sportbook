import { useLocation, useNavigate, Link } from "react-router-dom";
import { MdSportsSoccer, MdCalendarToday, MdAccessTime, MdArrowBack } from "react-icons/md";
import { HiCheckCircle } from "react-icons/hi";

// BookingStruk.jsx : halaman struk setelah booking berhasil
// Data booking dikirim via navigate state (location.state)
export default function BookingStruk() {
    const location = useLocation();
    const navigate = useNavigate();

    // ambil data dari state navigate
    const { booking, payment, field } = location.state || {};

    // kalau tidak ada data (akses langsung via URL), redirect ke home
    if (!booking || !payment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Data tidak ditemukan</p>
                    <Link to="/" className="text-orange-500 hover:underline text-sm">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-md mx-auto">

                {/* status berhasil */}
                <div className="text-center mb-6">
                    <HiCheckCircle className="text-green-500 text-6xl mx-auto mb-3" />
                    <h1 className="text-xl font-bold text-gray-900">Booking Berhasil!</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Segera lakukan pembayaran sebelum waktu habis
                    </p>
                </div>

                {/* kartu struk */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                    {/* header struk */}
                    <div className="bg-orange-500 px-5 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                            <MdSportsSoccer className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-base">SportBook</p>
                            <p className="text-orange-100 text-xs">Booking Lapangan Olahraga</p>
                        </div>
                    </div>

                    {/* detail booking */}
                    <div className="px-5 py-4 space-y-3">
                        <Row label="No. Booking" value={`#${booking.id}`} />
                        <Row label="Lapangan" value={field?.name || booking.Field?.name || "-"} bold />
                        <Row label="Jenis Olahraga" value={field?.sport_type || booking.Field?.sport_type || "-"} />

                        <div className="border-t border-dashed border-gray-200 my-1" />

                        <Row
                            label="Tanggal"
                            value={booking.booking_date}
                            icon={<MdCalendarToday className="text-orange-400" />}
                        />
                        <Row
                            label="Jam"
                            value={`${booking.start_time?.slice(0, 5)} - ${booking.end_time?.slice(0, 5)}`}
                            icon={<MdAccessTime className="text-orange-400" />}
                        />

                        <div className="border-t border-dashed border-gray-200 my-1" />

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Total Harga</span>
                            <span className="text-lg font-bold text-orange-500">
                                Rp {booking.total_price?.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>

                    {/* kotak kode pembayaran */}
                    <div className="mx-5 mb-5 bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">Kode Pembayaran</p>
                        <p className="font-mono font-bold text-orange-600 text-xl tracking-widest">
                            {payment.kode_pembayaran}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Bayar sebelum:{" "}
                            <span className="font-semibold text-red-500">
                                {new Date(payment.expired_at).toLocaleString("id-ID")}
                            </span>
                        </p>
                    </div>

                    {/* cara bayar */}
                    <div className="mx-5 mb-5 bg-gray-50 border border-gray-100 rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Cara Bayar
                        </p>
                        <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                            <li>Buka halaman <span className="font-semibold text-gray-700">Riwayat Booking</span></li>
                            <li>Masukkan kode pembayaran di atas</li>
                            <li>Klik tombol <span className="font-semibold text-gray-700">BAYAR</span></li>
                            <li>Tunggu konfirmasi dari admin</li>
                        </ol>
                    </div>

                </div>

                {/* tombol navigasi */}
                <div className="flex gap-3 mt-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-semibold text-sm py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <MdArrowBack /> Kembali
                    </button>
                    <Link to="/my-bookings" className="flex-1">
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-xl transition-colors">
                            Lihat Riwayat Booking
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

function Row({ label, value, bold = false, icon }) {
    return (
        <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-500 flex items-center gap-1">
                {icon} {label}
            </span>
            <span className={`text-sm text-right ${bold ? "font-bold text-gray-900" : "text-gray-700"}`}>
                {value}
            </span>
        </div>
    );
}
