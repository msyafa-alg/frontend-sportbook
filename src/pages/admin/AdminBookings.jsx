import { useState, useEffect } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import StatusBadgeComponent from "../../components/StatusBadgeComponent";
import { getAllBookingsService, approveBookingService, rejectBookingService } from "../../services/booking.service";
import { HiCheck, HiX, HiDownload } from "react-icons/hi";
import { MdBookOnline } from "react-icons/md";
import { exportToExcel } from "../../utils/exportExcel";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function getBookings() {
        try {
            const result = await getAllBookingsService();
            setBookings(result.data.data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    }  

    async function handleApprove(id) {
        setError("");
        try {
            await approveBookingService(id);
            setSuccess("Booking berhasil di-approve!");
            getBookings();
        } catch (error) { setError(error.response?.data?.data || "Gagal approve booking!"); }
    }

    async function handleReject(id) {
        if (!confirm("Yakin ingin menolak booking ini?")) return;
        setError("");
        try {
            await rejectBookingService(id);
            setSuccess("Booking berhasil di-reject!");
            getBookings();
        } catch (error) { setError(error.response?.data?.data || "Gagal reject booking!"); }
    }

    function handleExport() {
        const data = bookings.map((b) => ({
            "ID": b.id,
            "Nama User": b.User?.name || "-",
            "Lapangan": b.Field?.name || "-",
            "Jenis Olahraga": b.Field?.sport_type || "-",
            "Tanggal": b.booking_date,
            "Jam Mulai": b.start_time?.slice(0, 5),
            "Jam Selesai": b.end_time?.slice(0, 5),
            "Total Harga (Rp)": b.total_price,
            "Status": b.status,
        }));
        exportToExcel(data, "Data_Booking", "Booking");
    }

    useEffect(() => { getBookings(); }, []);

    if (loading) return <LoadingComponent />;

    return (
        <div>
            <div className="mb-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Manajemen Booking</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{bookings.length} total booking</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <HiDownload /> Export Excel
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    <HiX className="shrink-0" /> <span>{error}</span>
                    <button onClick={() => setError("")} className="ml-auto">✕</button>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
                    <HiCheck className="shrink-0" /> <span>{success}</span>
                    <button onClick={() => setSuccess("")} className="ml-auto">✕</button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {["User", "Lapangan", "Tanggal", "Jam", "Total", "Status", "Aksi"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-400">
                                        <MdBookOnline className="text-3xl mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Belum ada booking</p>
                                    </td>
                                </tr>
                            ) : bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">{b.User?.name || "-"}</td>
                                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{b.Field?.name || "-"}</td>
                                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{b.booking_date}</td>
                                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                                        {b.start_time?.slice(0, 5)} – {b.end_time?.slice(0, 5)}
                                    </td>
                                    <td className="px-5 py-3.5 font-semibold text-orange-500 whitespace-nowrap">
                                        Rp {b.total_price?.toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <StatusBadgeComponent status={b.status} />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {b.status === "paid" && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleApprove(b.id)} className="text-xs font-semibold text-green-600 border border-green-200 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
                                                    Approve
                                                </button>
                                                <button onClick={() => handleReject(b.id)} className="text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {b.status === "waiting_payment" && (
                                            <button onClick={() => handleReject(b.id)} className="text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                                Reject
                                            </button>
                                        )}
                                        {!["paid", "waiting_payment"].includes(b.status) && (
                                            <span className="text-gray-300 text-xs">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
