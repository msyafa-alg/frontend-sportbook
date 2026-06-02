import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdLock, MdArrowBack } from "react-icons/md";
import { HiX } from "react-icons/hi";
import LoadingComponent from "../components/LoadingComponent";
import { getFieldByIdService } from "../services/field.service";
import { createBookingService } from "../services/booking.service";
import { AuthContext } from "../context/AuthContext";

export default function FieldDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLogin } = useContext(AuthContext);

    const [field, setField] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState("");

    const [formBooking, setFormBooking] = useState({
        booking_date: "",
        start_time: "",
        end_time: "",
    });

    async function getField() {
        try {
            const result = await getFieldByIdService(id);
            setField(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    function hitungEstimasi() {
        if (!formBooking.start_time || !formBooking.end_time || !field) return 0;
        const [sh, sm] = formBooking.start_time.split(":").map(Number);
        const [eh, em] = formBooking.end_time.split(":").map(Number);
        const durasi = (eh * 60 + em - (sh * 60 + sm)) / 60;
        return durasi > 0 ? durasi * field.price_per_hour : 0;
    }

    async function handleBooking() {
        if (!formBooking.booking_date || !formBooking.start_time || !formBooking.end_time) {
            setError("Semua field harus diisi!");
            return;
        }
        if (hitungEstimasi() <= 0) {
            setError("Jam selesai harus lebih dari jam mulai!");
            return;
        }
        setBookingLoading(true);
        setError("");
        try {
            const result = await createBookingService({
                field_id: Number(id),
                booking_date: formBooking.booking_date,
                start_time: formBooking.start_time,
                end_time: formBooking.end_time,
            });

            // navigate ke halaman struk, kirim data via state
            navigate("/booking/struk", {
                state: {
                    booking: result.data.booking,
                    payment: result.data.payment,
                    field: field,
                }
            });
        } catch (error) {
            setError(error.response?.data?.data || "Booking gagal, jadwal mungkin sudah terisi!");
        } finally {
            setBookingLoading(false);
        }
    }

    useEffect(() => { getField(); }, [id]);

    if (loading) return <LoadingComponent />;
    if (!field) return (
        <div className="text-center py-20 text-gray-400">
            <p>Lapangan tidak ditemukan</p>
        </div>
    );

    const estimasi = hitungEstimasi();

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* breadcrumb */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="container mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors"
                    >
                        <MdArrowBack /> Kembali
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-5xl">
                {/* notifikasi error */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                        <HiX className="shrink-0" />
                        <span>{error}</span>
                        <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* ===== KIRI : detail lapangan ===== */}
                    <div className="lg:col-span-3">
                        <img
                            src={field.image || "https://placehold.co/800x450/f3f4f6/9ca3af?text=Lapangan"}
                            alt={field.name}
                            className="w-full rounded-lg object-cover h-64 mb-5"
                        />
                        <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-1">
                            {field.name}
                        </h1>
                        <p className="text-sm text-gray-500 mb-4">{field.sport_type}</p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-5">
                            {field.description || "Lapangan olahraga berkualitas dengan fasilitas lengkap."}
                        </p>
                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-xs text-gray-400 mb-1">Harga sewa per jam</p>
                            <p className="text-2xl font-bold text-orange-500">
                                Rp {field.price_per_hour?.toLocaleString("id-ID")}
                                <span className="text-sm font-normal text-gray-400"> /jam</span>
                            </p>
                        </div>
                    </div>

                    {/* ===== KANAN : form booking ===== */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-4">
                            <h2 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                                Pesan Lapangan
                            </h2>

                            {/* belum login */}
                            {!isLogin ? (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <MdLock className="text-xl text-gray-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">
                                        Login untuk melanjutkan
                                    </p>
                                    <p className="text-xs text-gray-400 mb-5">
                                        Kamu perlu login terlebih dahulu untuk memesan lapangan ini.
                                    </p>
                                    <Link to="/login">
                                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2.5 rounded transition-colors">
                                            LOGIN
                                        </button>
                                    </Link>
                                    <Link to="/register">
                                        <button className="w-full mt-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm py-2.5 rounded transition-colors">
                                            Belum punya akun? Register
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                /* sudah login — form booking */
                                <div className="flex flex-col gap-3.5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setFormBooking({ ...formBooking, booking_date: e.target.value })}
                                            className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                                Jam Mulai
                                            </label>
                                            <input
                                                type="time"
                                                onChange={(e) => setFormBooking({ ...formBooking, start_time: e.target.value })}
                                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                                Jam Selesai
                                            </label>
                                            <input
                                                type="time"
                                                onChange={(e) => setFormBooking({ ...formBooking, end_time: e.target.value })}
                                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            />
                                        </div>
                                    </div>

                                    {/* estimasi harga */}
                                    {estimasi > 0 && (
                                        <div className="bg-orange-50 border border-orange-100 rounded px-3 py-2.5 flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Estimasi total</span>
                                            <span className="font-bold text-orange-500 text-sm">
                                                Rp {estimasi.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleBooking}
                                        disabled={bookingLoading}
                                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded text-sm transition-colors"
                                    >
                                        {bookingLoading ? "Memproses..." : "BOOKING SEKARANG"}
                                    </button>
                                    <p className="text-xs text-gray-400 text-center">
                                        Kode pembayaran akan muncul setelah booking berhasil
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
