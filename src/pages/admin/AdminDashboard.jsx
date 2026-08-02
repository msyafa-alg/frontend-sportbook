import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import { getAllBookingsService } from "../../services/booking.service";
import { getFieldsService } from "../../services/field.service";
import { MdSportsSoccer, MdBookOnline, MdPendingActions, MdCheckCircle } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";
import StatusBadgeComponent from "../../components/StatusBadgeComponent";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalFields: 0, totalBookings: 0, pendingBookings: 0, approvedBookings: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getStats() {
        try {
            const [fieldsResult, bookingsResult] = await Promise.all([
                getFieldsService(),
                getAllBookingsService({ limit: 100 }),
            ]);
            const bookings = bookingsResult.data.data;
            setStats({
                totalFields: fieldsResult.data.length,
                totalBookings: bookingsResult.data.total,
                pendingBookings: bookings.filter((b) => b.status === "paid").length,
                approvedBookings: bookings.filter((b) => b.status === "approved").length,
            });
            setRecentBookings(bookings.slice(0, 5));
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => { getStats(); }, []);

    if (loading) return <LoadingComponent />;

    const statCards = [
        { label: "Total Lapangan", value: stats.totalFields, icon: MdSportsSoccer, color: "bg-blue-50 text-blue-600" },
        { label: "Total Booking", value: stats.totalBookings, icon: MdBookOnline, color: "bg-blue-50 text-blue-500" },
        { label: "Menunggu Approve", value: stats.pendingBookings, icon: MdPendingActions, color: "bg-yellow-50 text-yellow-500" },
        { label: "Booking Approved", value: stats.approvedBookings, icon: MdCheckCircle, color: "bg-green-50 text-green-500" },
    ];

    return (
        <div>
            {/* banner */}
            <div className="bg-blue-500 rounded-xl px-6 py-5 mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-white font-bold text-lg">Dashboard Admin</h2>
                    <p className="text-blue-100 text-sm mt-0.5">Kelola lapangan dan booking di sini</p>
                </div>
                <Link
                    to="/admin/fields"
                    className="flex items-center gap-2 bg-white text-blue-600 font-bold text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    Tambah Lapangan <HiArrowRight />
                </Link>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5">
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                                    <Icon className="text-lg" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* tabel booking terbaru */}
            <div className="bg-white rounded-xl border border-gray-100">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">Booking Terbaru</h3>
                    <Link to="/admin/bookings" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        Lihat semua <HiArrowRight />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Lapangan</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Tanggal</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                                        Belum ada booking
                                    </td>
                                </tr>
                            ) : recentBookings.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-gray-800">{b.User?.name || "-"}</td>
                                    <td className="px-5 py-3.5 text-gray-600">{b.Field?.name || "-"}</td>
                                    <td className="px-5 py-3.5 text-gray-500">{b.booking_date}</td>
                                    <td className="px-5 py-3.5 font-semibold text-blue-600">
                                        Rp {b.total_price?.toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <StatusBadgeComponent status={b.status} />
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
